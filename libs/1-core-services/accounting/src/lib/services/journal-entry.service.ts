/**
 * SEMOP - Journal Entry Service
 * خدمة إدارة القيود اليومية
 * 
 * @module JournalEntryService
 * @version 0.3.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/multi-entity';
import { JournalEntry, JournalEntryLine, JournalEntryType, JournalEntryStatus, Prisma } from '@prisma/client';

@Injectable()
export class JournalEntryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء قيد محاسبي جديد
   */
  async create(data: {
    entryDate: Date;
    description: string;
    reference?: string;
    entryType: JournalEntryType;
    fiscalYearId: string;
    holdingId?: string;
    unitId?: string;
    projectId?: string;
    lines: {
      lineNumber: number;
      accountId: string;
      description: string;
      debit: number;
      credit: number;
      costCenterId?: string;
    }[];
    createdBy?: string;
  }): Promise<JournalEntry> {
    // التحقق من وجود سطور
    if (!data.lines || data.lines.length === 0) {
      throw new BadRequestException('Journal entry must have at least one line');
    }

    // التحقق من توازن القيد
    const totalDebit = data.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = data.lines.reduce((sum, line) => sum + line.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(`Journal entry is not balanced: Debit=${totalDebit}, Credit=${totalCredit}`);
    }

    // التحقق من صحة السطور
    for (const line of data.lines) {
      // التحقق من أن السطر إما مدين أو دائن وليس كلاهما
      if ((line.debit > 0 && line.credit > 0) || (line.debit === 0 && line.credit === 0)) {
        throw new BadRequestException(`Line ${line.lineNumber} must be either debit or credit, not both or neither`);
      }

      // التحقق من وجود الحساب
      const account = await this.prisma.account.findUnique({
        where: { id: line.accountId },
      });

      if (!account) {
        throw new NotFoundException(`Account with ID ${line.accountId} not found`);
      }

      // التحقق من أن الحساب يسمح بالقيد المباشر
      if (!account.allowManualEntry) {
        throw new BadRequestException(`Account ${account.code} - ${account.nameEn} does not allow manual entry`);
      }

      // التحقق من أن الحساب نشط
      if (!account.isActive) {
        throw new BadRequestException(`Account ${account.code} - ${account.nameEn} is not active`);
      }

      // التحقق من وجود مركز التكلفة إذا تم تحديده
      if (line.costCenterId) {
        const costCenter = await this.prisma.costCenter.findUnique({
          where: { id: line.costCenterId },
        });

        if (!costCenter) {
          throw new NotFoundException(`Cost center with ID ${line.costCenterId} not found`);
        }

        if (!costCenter.isActive) {
          throw new BadRequestException(`Cost center ${costCenter.code} - ${costCenter.nameEn} is not active`);
        }
      }
    }

    // التحقق من وجود السنة المالية
    const fiscalYear = await this.prisma.fiscalYear.findUnique({
      where: { id: data.fiscalYearId },
    });

    if (!fiscalYear) {
      throw new NotFoundException(`Fiscal year with ID ${data.fiscalYearId} not found`);
    }

    // التحقق من أن السنة المالية مفتوحة
    if (fiscalYear.status !== 'OPEN') {
      throw new BadRequestException(`Fiscal year ${fiscalYear.code} is not open`);
    }

    // التحقق من أن تاريخ القيد ضمن السنة المالية
    if (data.entryDate < fiscalYear.startDate || data.entryDate > fiscalYear.endDate) {
      throw new BadRequestException(`Entry date must be within fiscal year ${fiscalYear.code}`);
    }

    // توليد رقم القيد
    const entryNumber = await this.generateEntryNumber(data.fiscalYearId);

    // إنشاء القيد مع السطور
    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        entryNumber,
        entryDate: data.entryDate,
        description: data.description,
        reference: data.reference,
        entryType: data.entryType,
        status: JournalEntryStatus.DRAFT,
        totalDebit,
        totalCredit,
        isBalanced: true,
        fiscalYearId: data.fiscalYearId,
        holdingId: data.holdingId,
        unitId: data.unitId,
        projectId: data.projectId,
        createdBy: data.createdBy,
        lines: {
          create: data.lines.map(line => ({
            lineNumber: line.lineNumber,
            accountId: line.accountId,
            description: line.description,
            debit: line.debit,
            credit: line.credit,
            costCenterId: line.costCenterId,
          })),
        },
      },
      include: {
        lines: {
          include: {
            account: true,
            costCenter: true,
          },
        },
        fiscalYear: true,
      },
    });

    return journalEntry;
  }

  /**
   * الحصول على جميع القيود
   */
  async findAll(filters?: {
    status?: JournalEntryStatus;
    entryType?: JournalEntryType;
    fiscalYearId?: string;
    holdingId?: string;
    unitId?: string;
    projectId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<JournalEntry[]> {
    const where: Prisma.JournalEntryWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.entryType) {
      where.entryType = filters.entryType;
    }

    if (filters?.fiscalYearId) {
      where.fiscalYearId = filters.fiscalYearId;
    }

    if (filters?.holdingId) {
      where.holdingId = filters.holdingId;
    }

    if (filters?.unitId) {
      where.unitId = filters.unitId;
    }

    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.entryDate = {};
      if (filters.startDate) {
        where.entryDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.entryDate.lte = filters.endDate;
      }
    }

    return this.prisma.journalEntry.findMany({
      where,
      include: {
        lines: {
          include: {
            account: true,
            costCenter: true,
          },
        },
        fiscalYear: true,
      },
      orderBy: {
        entryDate: 'desc',
      },
    });
  }

  /**
   * الحصول على قيد بالمعرف
   */
  async findOne(id: string): Promise<JournalEntry> {
    const journalEntry = await this.prisma.journalEntry.findUnique({
      where: { id },
      include: {
        lines: {
          include: {
            account: true,
            costCenter: true,
          },
          orderBy: {
            lineNumber: 'asc',
          },
        },
        fiscalYear: true,
        reversalOf: true,
        reversals: true,
      },
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal entry with ID ${id} not found`);
    }

    return journalEntry;
  }

  /**
   * الحصول على قيد برقم القيد
   */
  async findByEntryNumber(entryNumber: string): Promise<JournalEntry> {
    const journalEntry = await this.prisma.journalEntry.findUnique({
      where: { entryNumber },
      include: {
        lines: {
          include: {
            account: true,
            costCenter: true,
          },
        },
        fiscalYear: true,
      },
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal entry with number ${entryNumber} not found`);
    }

    return journalEntry;
  }

  /**
   * تحديث قيد (فقط في حالة DRAFT)
   */
  async update(
    id: string,
    data: {
      entryDate?: Date;
      description?: string;
      reference?: string;
      lines?: {
        lineNumber: number;
        accountId: string;
        description: string;
        debit: number;
        credit: number;
        costCenterId?: string;
      }[];
      updatedBy?: string;
    }
  ): Promise<JournalEntry> {
    const journalEntry = await this.findOne(id);

    // التحقق من أن القيد في حالة DRAFT
    if (journalEntry.status !== JournalEntryStatus.DRAFT) {
      throw new BadRequestException('Only draft journal entries can be updated');
    }

    // إذا تم تحديث السطور، التحقق من التوازن
    if (data.lines) {
      const totalDebit = data.lines.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = data.lines.reduce((sum, line) => sum + line.credit, 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new BadRequestException(`Journal entry is not balanced: Debit=${totalDebit}, Credit=${totalCredit}`);
      }

      // حذف السطور القديمة
      await this.prisma.journalEntryLine.deleteMany({
        where: { journalEntryId: id },
      });

      // إنشاء السطور الجديدة
      await this.prisma.journalEntryLine.createMany({
        data: data.lines.map(line => ({
          journalEntryId: id,
          lineNumber: line.lineNumber,
          accountId: line.accountId,
          description: line.description,
          debit: line.debit,
          credit: line.credit,
          costCenterId: line.costCenterId,
        })),
      });

      return this.prisma.journalEntry.update({
        where: { id },
        data: {
          entryDate: data.entryDate,
          description: data.description,
          reference: data.reference,
          totalDebit,
          totalCredit,
          updatedBy: data.updatedBy,
        },
        include: {
          lines: {
            include: {
              account: true,
              costCenter: true,
            },
          },
          fiscalYear: true,
        },
      });
    }

    return this.prisma.journalEntry.update({
      where: { id },
      data: {
        entryDate: data.entryDate,
        description: data.description,
        reference: data.reference,
        updatedBy: data.updatedBy,
      },
      include: {
        lines: {
          include: {
            account: true,
            costCenter: true,
          },
        },
        fiscalYear: true,
      },
    });
  }

  /**
   * حذف قيد (فقط في حالة DRAFT)
   */
  async remove(id: string): Promise<JournalEntry> {
    const journalEntry = await this.findOne(id);

    // التحقق من أن القيد في حالة DRAFT
    if (journalEntry.status !== JournalEntryStatus.DRAFT) {
      throw new BadRequestException('Only draft journal entries can be deleted');
    }

    return this.prisma.journalEntry.delete({
      where: { id },
    });
  }

  /**
   * ترحيل قيد (Post)
   */
  async post(id: string, userId?: string): Promise<JournalEntry> {
    const journalEntry = await this.findOne(id);

    // التحقق من أن القيد في حالة DRAFT
    if (journalEntry.status !== JournalEntryStatus.DRAFT) {
      throw new BadRequestException('Only draft journal entries can be posted');
    }

    // التحقق من توازن القيد
    if (!journalEntry.isBalanced) {
      throw new BadRequestException('Journal entry must be balanced before posting');
    }

    // ترحيل القيد
    const postedEntry = await this.prisma.journalEntry.update({
      where: { id },
      data: {
        status: JournalEntryStatus.POSTED,
        postedAt: new Date(),
        postedBy: userId,
      },
      include: {
        lines: {
          include: {
            account: true,
            costCenter: true,
          },
        },
        fiscalYear: true,
      },
    });

    // تحديث أرصدة الحسابات
    await this.updateAccountBalances(postedEntry);

    return postedEntry;
  }

  /**
   * عكس قيد (Reverse)
   */
  async reverse(id: string, userId?: string): Promise<JournalEntry> {
    const originalEntry = await this.findOne(id);

    // التحقق من أن القيد مرحّل
    if (originalEntry.status !== JournalEntryStatus.POSTED) {
      throw new BadRequestException('Only posted journal entries can be reversed');
    }

    // التحقق من أن القيد لم يتم عكسه مسبقاً
    if (originalEntry.reversedAt) {
      throw new BadRequestException('Journal entry has already been reversed');
    }

    // إنشاء قيد عكسي
    const reversalLines = originalEntry.lines.map(line => ({
      lineNumber: line.lineNumber,
      accountId: line.accountId,
      description: `Reversal of: ${line.description}`,
      debit: line.credit, // عكس المدين والدائن
      credit: line.debit,
      costCenterId: line.costCenterId,
    }));

    const reversalEntry = await this.create({
      entryDate: new Date(),
      description: `Reversal of: ${originalEntry.description}`,
      reference: originalEntry.reference,
      entryType: JournalEntryType.ADJUSTMENT,
      fiscalYearId: originalEntry.fiscalYearId,
      holdingId: originalEntry.holdingId,
      unitId: originalEntry.unitId,
      projectId: originalEntry.projectId,
      lines: reversalLines,
      createdBy: userId,
    });

    // ترحيل القيد العكسي تلقائياً
    await this.post(reversalEntry.id, userId);

    // تحديث القيد الأصلي
    await this.prisma.journalEntry.update({
      where: { id },
      data: {
        status: JournalEntryStatus.REVERSED,
        reversedAt: new Date(),
        reversedBy: userId,
      },
    });

    // ربط القيد العكسي بالقيد الأصلي
    await this.prisma.journalEntry.update({
      where: { id: reversalEntry.id },
      data: {
        reversalOfId: id,
      },
    });

    return reversalEntry;
  }

  /**
   * عد القيود
   */
  async count(filters?: {
    status?: JournalEntryStatus;
    fiscalYearId?: string;
  }): Promise<number> {
    const where: Prisma.JournalEntryWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.fiscalYearId) {
      where.fiscalYearId = filters.fiscalYearId;
    }

    return this.prisma.journalEntry.count({ where });
  }

  /**
   * توليد رقم قيد جديد
   */
  private async generateEntryNumber(fiscalYearId: string): Promise<string> {
    const fiscalYear = await this.prisma.fiscalYear.findUnique({
      where: { id: fiscalYearId },
    });

    if (!fiscalYear) {
      throw new NotFoundException(`Fiscal year with ID ${fiscalYearId} not found`);
    }

    const count = await this.prisma.journalEntry.count({
      where: { fiscalYearId },
    });

    const year = new Date(fiscalYear.startDate).getFullYear();
    const sequence = (count + 1).toString().padStart(4, '0');

    return `JE-${year}-${sequence}`;
  }

  /**
   * تحديث أرصدة الحسابات بعد الترحيل
   */
  private async updateAccountBalances(journalEntry: JournalEntry & { lines: JournalEntryLine[] }) {
    for (const line of journalEntry.lines) {
      // الحصول على الرصيد الحالي أو إنشاء رصيد جديد
      const balance = await this.prisma.accountBalance.upsert({
        where: {
          accountId_fiscalYearId: {
            accountId: line.accountId,
            fiscalYearId: journalEntry.fiscalYearId,
          },
        },
        create: {
          accountId: line.accountId,
          fiscalYearId: journalEntry.fiscalYearId,
          openingBalance: 0,
          closingBalance: 0,
          debitTotal: line.debit,
          creditTotal: line.credit,
        },
        update: {
          debitTotal: {
            increment: line.debit,
          },
          creditTotal: {
            increment: line.credit,
          },
        },
      });

      // حساب الرصيد الختامي
      const account = await this.prisma.account.findUnique({
        where: { id: line.accountId },
      });

      if (account) {
        let closingBalance = balance.openingBalance;

        if (account.accountNature === 'DEBIT') {
          closingBalance = balance.openingBalance + balance.debitTotal - balance.creditTotal;
        } else {
          closingBalance = balance.openingBalance + balance.creditTotal - balance.debitTotal;
        }

        await this.prisma.accountBalance.update({
          where: {
            accountId_fiscalYearId: {
              accountId: line.accountId,
              fiscalYearId: journalEntry.fiscalYearId,
            },
          },
          data: {
            closingBalance,
          },
        });
      }
    }
  }
}
