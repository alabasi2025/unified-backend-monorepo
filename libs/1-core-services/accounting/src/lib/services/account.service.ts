/**
 * SEMOP - Account Service
 * خدمة إدارة دليل الحسابات
 * 
 * @module AccountService
 * @version 0.3.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/multi-entity';
import { Account, AccountType, AccountNature, Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء حساب جديد
   */
  async create(data: {
    code: string;
    nameAr: string;
    nameEn: string;
    description?: string;
    accountType: AccountType;
    accountNature: AccountNature;
    level: number;
    isParent?: boolean;
    allowManualEntry?: boolean;
    parentId?: string;
    holdingId?: string;
    unitId?: string;
    institutionId?: string; // إضافة institutionId
    createdBy?: string;
  }): Promise<Account> {
    // التحقق من عدم تكرار الكود
    const existingAccount = await this.prisma.account.findUnique({
      where: { code: data.code },
    });

    if (existingAccount) {
      throw new ConflictException(`Account with code ${data.code} already exists`);
    }

    // التحقق من وجود الحساب الأب إذا تم تحديده
    if (data.parentId) {
      const parent = await this.prisma.account.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new NotFoundException(`Parent account with ID ${data.parentId} not found`);
      }

      // التحقق من أن الحساب الأب هو حساب رئيسي
      if (!parent.isParent) {
        throw new BadRequestException('Parent account must be a parent account (isParent = true)');
      }

      // التحقق من أن نوع الحساب الفرعي يطابق نوع الحساب الأب
      if (parent.accountType !== data.accountType) {
        throw new BadRequestException('Child account type must match parent account type');
      }
    }

    // التحقق من أن الحسابات الرئيسية لا تسمح بالقيد المباشر
    if (data.isParent && data.allowManualEntry) {
      throw new BadRequestException('Parent accounts cannot allow manual entry');
    }

    // التحقق من أن الحسابات الفرعية التي تسمح بالقيد المباشر يجب أن تكون مرتبطة بمؤسسة
    if (!data.isParent && (data.allowManualEntry ?? true) && !data.institutionId) {
      throw new BadRequestException('Sub-accounts that allow manual entry must be linked to an institution');
    }

    // إنشاء الحساب
    const account = await this.prisma.account.create({
      data: {
        code: data.code,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        description: data.description,
        accountType: data.accountType,
        accountNature: data.accountNature,
        level: data.level,
        isParent: data.isParent || false,
        allowManualEntry: data.isParent ? false : (data.allowManualEntry ?? true),
        parentId: data.parentId,
        holdingId: data.holdingId,
        unitId: data.unitId,
        institutionId: data.institutionId, // إضافة institutionId
        createdBy: data.createdBy,
      },
    });

    // إنشاء سجلات التسلسل الهرمي
    if (data.parentId) {
      await this.updateAccountHierarchy(account.id, data.parentId);
    }

    return account;
  }

  /**
   * الحصول على جميع الحسابات
   */
  async findAll(filters?: {
    accountType?: AccountType;
    isActive?: boolean;
    isParent?: boolean;
    allowManualEntry?: boolean;
    holdingId?: string;
    unitId?: string;
    institutionId?: string; // إضافة institutionId
  }): Promise<Account[]> {
    const where: Prisma.AccountWhereInput = {};

    if (filters?.accountType) {
      where.accountType = filters.accountType;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.isParent !== undefined) {
      where.isParent = filters.isParent;
    }

    if (filters?.allowManualEntry !== undefined) {
      where.allowManualEntry = filters.allowManualEntry;
    }

    if (filters?.holdingId) {
      where.holdingId = filters.holdingId;
    }

    if (filters?.unitId) {
      where.unitId = filters.unitId;
    }

    if (filters?.institutionId) { // إضافة institutionId
      where.institutionId = filters.institutionId;
    }

    return this.prisma.account.findMany({
      where,
      include: {
        parent: true,
        children: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * الحصول على حساب بالمعرف
   */
  async findOne(id: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        accountBalances: {
          include: {
            fiscalYear: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }

  /**
   * الحصول على حساب بالكود
   */
  async findByCode(code: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { code },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with code ${code} not found`);
    }

    return account;
  }

  /**
   * تحديث حساب
   */
  async update(
    id: string,
    data: {
      code?: string;
      nameAr?: string;
      nameEn?: string;
      description?: string;
      isActive?: boolean;
      allowManualEntry?: boolean;
      updatedBy?: string;
    }
  ): Promise<Account> {
    const account = await this.findOne(id);

    // التحقق من عدم تكرار الكود إذا تم تغييره
    if (data.code && data.code !== account.code) {
      const existingAccount = await this.prisma.account.findUnique({
        where: { code: data.code },
      });

      if (existingAccount) {
        throw new ConflictException(`Account with code ${data.code} already exists`);
      }
    }

    // التحقق من أن الحسابات الرئيسية لا تسمح بالقيد المباشر
    if (account.isParent && data.allowManualEntry) {
      throw new BadRequestException('Parent accounts cannot allow manual entry');
    }

    // التحقق من أن الحسابات الفرعية التي تسمح بالقيد المباشر يجب أن تكون مرتبطة بمؤسسة
    if (!account.isParent && (data.allowManualEntry ?? account.allowManualEntry) && !account.institutionId) {
      throw new BadRequestException('Sub-accounts that allow manual entry must be linked to an institution');
    }

    return this.prisma.account.update({
      where: { id },
      data: {
        code: data.code,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        description: data.description,
        isActive: data.isActive,
        allowManualEntry: data.allowManualEntry,
        updatedBy: data.updatedBy,
      },
    });
  }

  /**
   * حذف حساب (Soft Delete)
   */
  async remove(id: string, userId?: string): Promise<Account> {
    const account = await this.findOne(id);

    // التحقق من عدم وجود حسابات فرعية
    if (account.children && account.children.length > 0) {
      throw new BadRequestException('Cannot delete account with child accounts');
    }

    // التحقق من عدم وجود قيود محاسبية
    const journalEntryLinesCount = await this.prisma.journalEntryLine.count({
      where: { accountId: id },
    });

    if (journalEntryLinesCount > 0) {
      throw new BadRequestException('Cannot delete account with journal entry lines');
    }

    return this.prisma.account.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: userId,
      },
    });
  }

  /**
   * تفعيل حساب
   */
  async activate(id: string, userId?: string): Promise<Account> {
    await this.findOne(id);

    return this.prisma.account.update({
      where: { id },
      data: {
        isActive: true,
        updatedBy: userId,
      },
    });
  }

  /**
   * عد الحسابات
   */
  async count(filters?: {
    accountType?: AccountType;
    isActive?: boolean;
    isParent?: boolean;
  }): Promise<number> {
    const where: Prisma.AccountWhereInput = {};

    if (filters?.accountType) {
      where.accountType = filters.accountType;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.isParent !== undefined) {
      where.isParent = filters.isParent;
    }

    return this.prisma.account.count({ where });
  }

  /**
   * الحصول على الحسابات الفرعية
   */
  async getChildren(parentId: string): Promise<Account[]> {
    await this.findOne(parentId);

    return this.prisma.account.findMany({
      where: { parentId },
      include: {
        children: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * الحصول على جميع الحسابات الفرعية (بشكل متكرر)
   */
  async getAllDescendants(parentId: string): Promise<Account[]> {
    const descendants = await this.prisma.accountHierarchy.findMany({
      where: {
        ancestorId: parentId,
        depth: { gt: 0 },
      },
      include: {
        account: true,
      },
      orderBy: {
        depth: 'asc',
      },
    });

    return descendants.map(d => d.account);
  }

  /**
   * الحصول على جميع الحسابات الأصلية (Ancestors)
   */
  async getAncestors(accountId: string): Promise<Account[]> {
    const ancestors = await this.prisma.accountHierarchy.findMany({
      where: {
        accountId,
        depth: { gt: 0 },
      },
      include: {
        ancestor: true,
      },
      orderBy: {
        depth: 'desc',
      },
    });

    return ancestors.map(a => a.ancestor);
  }

  /**
   * الحصول على رصيد حساب في سنة مالية محددة
   */
  async getBalance(accountId: string, fiscalYearId: string) {
    const balance = await this.prisma.accountBalance.findUnique({
      where: {
        accountId_fiscalYearId: {
          accountId,
          fiscalYearId,
        },
      },
      include: {
        account: true,
        fiscalYear: true,
      },
    });

    if (!balance) {
      // إنشاء رصيد جديد إذا لم يكن موجوداً
      return this.prisma.accountBalance.create({
        data: {
          accountId,
          fiscalYearId,
          openingBalance: 0,
          closingBalance: 0,
          debitTotal: 0,
          creditTotal: 0,
        },
        include: {
          account: true,
          fiscalYear: true,
        },
      });
    }

    return balance;
  }

  /**
   * تحديث التسلسل الهرمي للحساب
   */
  private async updateAccountHierarchy(accountId: string, parentId: string) {
    // حذف السجلات القديمة
    await this.prisma.accountHierarchy.deleteMany({
      where: { accountId },
    });

    // إضافة سجل للحساب نفسه
    await this.prisma.accountHierarchy.create({
      data: {
        accountId,
        ancestorId: accountId,
        depth: 0,
      },
    });

    // إضافة سجلات للأصول
    const parentHierarchy = await this.prisma.accountHierarchy.findMany({
      where: { accountId: parentId },
    });

    for (const ancestor of parentHierarchy) {
      await this.prisma.accountHierarchy.create({
        data: {
          accountId,
          ancestorId: ancestor.ancestorId,
          depth: ancestor.depth + 1,
        },
      });
    }
  }

  /**
   * توليد دليل حسابات افتراضي
   */
  async generateDefaultChartOfAccounts(holdingId?: string, institutionId?: string, createdBy?: string): Promise<Account[]> {
    const accounts: Account[] = [];

    // 1. الأصول (Assets)
    const assets = await this.create({
      code: '1',
      nameAr: 'الأصول',
      nameEn: 'Assets',
      accountType: AccountType.ASSET,
      accountNature: AccountNature.DEBIT,
      level: 1,
      isParent: true,
      allowManualEntry: false,
      holdingId,
      institutionId, // إضافة institutionId
      createdBy,
    });
    accounts.push(assets);

    // 1.1 الأصول المتداولة
    const currentAssets = await this.create({
      code: '11',
      nameAr: 'الأصول المتداولة',
      nameEn: 'Current Assets',
      accountType: AccountType.ASSET,
      accountNature: AccountNature.DEBIT,
      level: 2,
      isParent: true,
      allowManualEntry: false,
      parentId: assets.id,
      holdingId,
      institutionId, // إضافة institutionId
      createdBy,
    });
    accounts.push(currentAssets);

    // 1.1.1 النقدية
    const cash = await this.create({
      code: '1101',
      nameAr: 'النقدية',
      nameEn: 'Cash',
      accountType: AccountType.ASSET,
      accountNature: AccountNature.DEBIT,
      level: 3,
      isParent: false,
      allowManualEntry: true,
      parentId: currentAssets.id,
      holdingId,
      institutionId, // إضافة institutionId
      createdBy,
    });
    accounts.push(cash);

    // 1.1.2 البنك
    const bank = await this.create({
      code: '1102',
      nameAr: 'البنك',
      nameEn: 'Bank',
      accountType: AccountType.ASSET,
      accountNature: AccountNature.DEBIT,
      level: 3,
      isParent: false,
      allowManualEntry: true,
      parentId: currentAssets.id,
      holdingId,
      institutionId, // إضافة institutionId
      createdBy,
    });
    accounts.push(bank);

    // 2. الخصوم (Liabilities)
    const liabilities = await this.create({
      code: '2',
      nameAr: 'الخصوم',
      nameEn: 'Liabilities',
      accountType: AccountType.LIABILITY,
      accountNature: AccountNature.CREDIT,
      level: 1,
      isParent: true,
      allowManualEntry: false,
      holdingId,
      institutionId, // إضافة institutionId
      createdBy,
    });
    accounts.push(liabilities);

    // 3. حقوق الملكية (Equity)
    const equity = await this.create({
      code: '3',
      nameAr: 'حقوق الملكية',
      nameEn: 'Equity',
      accountType: AccountType.EQUITY,
      accountNature: AccountNature.CREDIT,
      level: 1,
      isParent: true,
      allowManualEntry: false,
      holdingId,
      institutionId, // إضافة institutionId
      createdBy,
    });
    accounts.push(equity);

    // 4. الإيرادات (Revenue)
    const revenue = await this.create({
      code: '4',
      nameAr: 'الإيرادات',
      nameEn: 'Revenue',
      accountType: AccountType.REVENUE,
      accountNature: AccountNature.CREDIT,
      level: 1,
      isParent: true,
      allowManualEntry: false,
      holdingId,
      institutionId, // إضافة institutionId
      createdBy,
    });
    accounts.push(revenue);

    // 5. المصروفات (Expenses)
    const expenses = await this.create({
      code: '5',
      nameAr: 'المصروفات',
      nameEn: 'Expenses',
      accountType: AccountType.EXPENSE,
      accountNature: AccountNature.DEBIT,
      level: 1,
      isParent: true,
      allowManualEntry: false,
      holdingId,
      institutionId, // إضافة institutionId
      createdBy,
    });
    accounts.push(expenses);

    return accounts;
  }
}
