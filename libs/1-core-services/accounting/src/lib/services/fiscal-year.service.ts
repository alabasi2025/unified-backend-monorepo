/**
 * SEMOP - Fiscal Year Service
 * خدمة إدارة السنوات المالية والفترات المحاسبية
 * 
 * @module FiscalYearService
 * @version 0.3.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/multi-entity';
import { FiscalYear, FiscalPeriod, FiscalYearStatus, FiscalPeriodStatus, Prisma } from '@prisma/client';

@Injectable()
export class FiscalYearService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء سنة مالية جديدة
   */
  async create(data: {
    code: string;
    nameAr: string;
    nameEn: string;
    startDate: Date;
    endDate: Date;
    isCurrent?: boolean;
    holdingId?: string;
    createdBy?: string;
  }): Promise<FiscalYear> {
    // التحقق من عدم تكرار الكود
    const existingFiscalYear = await this.prisma.fiscalYear.findUnique({
      where: { code: data.code },
    });

    if (existingFiscalYear) {
      throw new ConflictException(`Fiscal year with code ${data.code} already exists`);
    }

    // التحقق من صحة التواريخ
    if (data.endDate <= data.startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // إذا كانت السنة الحالية، إلغاء تحديد السنة الحالية السابقة
    if (data.isCurrent) {
      await this.prisma.fiscalYear.updateMany({
        where: {
          isCurrent: true,
          holdingId: data.holdingId,
        },
        data: {
          isCurrent: false,
        },
      });
    }

    // إنشاء السنة المالية
    const fiscalYear = await this.prisma.fiscalYear.create({
      data: {
        code: data.code,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        startDate: data.startDate,
        endDate: data.endDate,
        status: FiscalYearStatus.OPEN,
        isCurrent: data.isCurrent || false,
        holdingId: data.holdingId,
        createdBy: data.createdBy,
      },
    });

    // إنشاء الفترات المحاسبية (12 شهر)
    await this.generateFiscalPeriods(fiscalYear.id);

    return fiscalYear;
  }

  /**
   * الحصول على جميع السنوات المالية
   */
  async findAll(filters?: {
    status?: FiscalYearStatus;
    isCurrent?: boolean;
    holdingId?: string;
  }): Promise<FiscalYear[]> {
    const where: Prisma.FiscalYearWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.isCurrent !== undefined) {
      where.isCurrent = filters.isCurrent;
    }

    if (filters?.holdingId) {
      where.holdingId = filters.holdingId;
    }

    return this.prisma.fiscalYear.findMany({
      where,
      include: {
        periods: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  /**
   * الحصول على سنة مالية بالمعرف
   */
  async findOne(id: string): Promise<FiscalYear> {
    const fiscalYear = await this.prisma.fiscalYear.findUnique({
      where: { id },
      include: {
        periods: {
          orderBy: {
            periodNumber: 'asc',
          },
        },
        journalEntries: {
          include: {
            lines: true,
          },
        },
        accountBalances: {
          include: {
            account: true,
          },
        },
      },
    });

    if (!fiscalYear) {
      throw new NotFoundException(`Fiscal year with ID ${id} not found`);
    }

    return fiscalYear;
  }

  /**
   * الحصول على سنة مالية بالكود
   */
  async findByCode(code: string): Promise<FiscalYear> {
    const fiscalYear = await this.prisma.fiscalYear.findUnique({
      where: { code },
      include: {
        periods: true,
      },
    });

    if (!fiscalYear) {
      throw new NotFoundException(`Fiscal year with code ${code} not found`);
    }

    return fiscalYear;
  }

  /**
   * الحصول على السنة المالية الحالية
   */
  async getCurrentFiscalYear(holdingId?: string): Promise<FiscalYear> {
    const fiscalYear = await this.prisma.fiscalYear.findFirst({
      where: {
        isCurrent: true,
        holdingId,
      },
      include: {
        periods: true,
      },
    });

    if (!fiscalYear) {
      throw new NotFoundException('No current fiscal year found');
    }

    return fiscalYear;
  }

  /**
   * تحديث سنة مالية
   */
  async update(
    id: string,
    data: {
      code?: string;
      nameAr?: string;
      nameEn?: string;
      startDate?: Date;
      endDate?: Date;
      updatedBy?: string;
    }
  ): Promise<FiscalYear> {
    const fiscalYear = await this.findOne(id);

    // التحقق من أن السنة المالية ليست مقفلة
    if (fiscalYear.status === FiscalYearStatus.LOCKED) {
      throw new BadRequestException('Cannot update locked fiscal year');
    }

    // التحقق من عدم تكرار الكود إذا تم تغييره
    if (data.code && data.code !== fiscalYear.code) {
      const existingFiscalYear = await this.prisma.fiscalYear.findUnique({
        where: { code: data.code },
      });

      if (existingFiscalYear) {
        throw new ConflictException(`Fiscal year with code ${data.code} already exists`);
      }
    }

    // التحقق من صحة التواريخ إذا تم تحديثها
    const startDate = data.startDate || fiscalYear.startDate;
    const endDate = data.endDate || fiscalYear.endDate;

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.prisma.fiscalYear.update({
      where: { id },
      data: {
        code: data.code,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        startDate: data.startDate,
        endDate: data.endDate,
        updatedBy: data.updatedBy,
      },
    });
  }

  /**
   * إغلاق سنة مالية
   */
  async close(id: string, userId?: string): Promise<FiscalYear> {
    const fiscalYear = await this.findOne(id);

    // التحقق من أن السنة المالية مفتوحة
    if (fiscalYear.status !== FiscalYearStatus.OPEN) {
      throw new BadRequestException('Only open fiscal years can be closed');
    }

    // التحقق من أن جميع الفترات مغلقة
    const openPeriods = fiscalYear.periods?.filter(p => p.status === FiscalPeriodStatus.OPEN) || [];
    if (openPeriods.length > 0) {
      throw new BadRequestException('All fiscal periods must be closed before closing the fiscal year');
    }

    return this.prisma.fiscalYear.update({
      where: { id },
      data: {
        status: FiscalYearStatus.CLOSED,
        updatedBy: userId,
      },
    });
  }

  /**
   * قفل سنة مالية (نهائياً)
   */
  async lock(id: string, userId?: string): Promise<FiscalYear> {
    const fiscalYear = await this.findOne(id);

    // التحقق من أن السنة المالية مغلقة
    if (fiscalYear.status !== FiscalYearStatus.CLOSED) {
      throw new BadRequestException('Only closed fiscal years can be locked');
    }

    return this.prisma.fiscalYear.update({
      where: { id },
      data: {
        status: FiscalYearStatus.LOCKED,
        updatedBy: userId,
      },
    });
  }

  /**
   * إعادة فتح سنة مالية
   */
  async reopen(id: string, userId?: string): Promise<FiscalYear> {
    const fiscalYear = await this.findOne(id);

    // التحقق من أن السنة المالية مغلقة (وليست مقفلة)
    if (fiscalYear.status !== FiscalYearStatus.CLOSED) {
      throw new BadRequestException('Only closed fiscal years can be reopened');
    }

    return this.prisma.fiscalYear.update({
      where: { id },
      data: {
        status: FiscalYearStatus.OPEN,
        updatedBy: userId,
      },
    });
  }

  /**
   * تعيين سنة مالية كسنة حالية
   */
  async setAsCurrent(id: string, userId?: string): Promise<FiscalYear> {
    const fiscalYear = await this.findOne(id);

    // إلغاء تحديد السنة الحالية السابقة
    await this.prisma.fiscalYear.updateMany({
      where: {
        isCurrent: true,
        holdingId: fiscalYear.holdingId,
      },
      data: {
        isCurrent: false,
      },
    });

    return this.prisma.fiscalYear.update({
      where: { id },
      data: {
        isCurrent: true,
        updatedBy: userId,
      },
    });
  }

  /**
   * عد السنوات المالية
   */
  async count(filters?: {
    status?: FiscalYearStatus;
  }): Promise<number> {
    const where: Prisma.FiscalYearWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.fiscalYear.count({ where });
  }

  /**
   * توليد الفترات المحاسبية (12 شهر)
   */
  private async generateFiscalPeriods(fiscalYearId: string): Promise<void> {
    const fiscalYear = await this.prisma.fiscalYear.findUnique({
      where: { id: fiscalYearId },
    });

    if (!fiscalYear) {
      throw new NotFoundException(`Fiscal year with ID ${fiscalYearId} not found`);
    }

    const monthsAr = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const monthsEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const startDate = new Date(fiscalYear.startDate);
    const endDate = new Date(fiscalYear.endDate);

    for (let i = 0; i < 12; i++) {
      const periodStart = new Date(startDate);
      periodStart.setMonth(startDate.getMonth() + i);

      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(0); // آخر يوم في الشهر

      // التأكد من عدم تجاوز نهاية السنة المالية
      if (periodEnd > endDate) {
        periodEnd.setTime(endDate.getTime());
      }

      const monthIndex = periodStart.getMonth();

      await this.prisma.fiscalPeriod.create({
        data: {
          fiscalYearId,
          periodNumber: i + 1,
          nameAr: monthsAr[monthIndex],
          nameEn: monthsEn[monthIndex],
          startDate: periodStart,
          endDate: periodEnd,
          status: FiscalPeriodStatus.OPEN,
        },
      });

      // إذا وصلنا لنهاية السنة المالية، نتوقف
      if (periodEnd >= endDate) {
        break;
      }
    }
  }

  /**
   * إغلاق فترة محاسبية
   */
  async closePeriod(periodId: string): Promise<FiscalPeriod> {
    const period = await this.prisma.fiscalPeriod.findUnique({
      where: { id: periodId },
      include: {
        fiscalYear: true,
      },
    });

    if (!period) {
      throw new NotFoundException(`Fiscal period with ID ${periodId} not found`);
    }

    // التحقق من أن الفترة مفتوحة
    if (period.status !== FiscalPeriodStatus.OPEN) {
      throw new BadRequestException('Only open fiscal periods can be closed');
    }

    // التحقق من أن السنة المالية مفتوحة
    if (period.fiscalYear.status !== FiscalYearStatus.OPEN) {
      throw new BadRequestException('Cannot close period in a closed fiscal year');
    }

    return this.prisma.fiscalPeriod.update({
      where: { id: periodId },
      data: {
        status: FiscalPeriodStatus.CLOSED,
      },
    });
  }

  /**
   * إعادة فتح فترة محاسبية
   */
  async reopenPeriod(periodId: string): Promise<FiscalPeriod> {
    const period = await this.prisma.fiscalPeriod.findUnique({
      where: { id: periodId },
      include: {
        fiscalYear: true,
      },
    });

    if (!period) {
      throw new NotFoundException(`Fiscal period with ID ${periodId} not found`);
    }

    // التحقق من أن الفترة مغلقة
    if (period.status !== FiscalPeriodStatus.CLOSED) {
      throw new BadRequestException('Only closed fiscal periods can be reopened');
    }

    // التحقق من أن السنة المالية ليست مقفلة
    if (period.fiscalYear.status === FiscalYearStatus.LOCKED) {
      throw new BadRequestException('Cannot reopen period in a locked fiscal year');
    }

    return this.prisma.fiscalPeriod.update({
      where: { id: periodId },
      data: {
        status: FiscalPeriodStatus.OPEN,
      },
    });
  }
}
