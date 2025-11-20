import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { PayrollPeriod, Prisma, PayrollStatus } from '@prisma/client';

@Injectable()
export class PayrollPeriodService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PayrollPeriodCreateInput): Promise<PayrollPeriod> {
    return this.prisma.payrollPeriod.create({ data, include: { journalEntry: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.PayrollPeriodWhereInput; orderBy?: Prisma.PayrollPeriodOrderByWithRelationInput;
  }): Promise<{ data: PayrollPeriod[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.payrollPeriod.findMany({ skip, take, where, orderBy, include: { journalEntry: true } }),
      this.prisma.payrollPeriod.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<PayrollPeriod> {
    const period = await this.prisma.payrollPeriod.findUnique({
      where: { id },
      include: {
        journalEntry: true,
        items: { include: { employee: true } },
      },
    });
    if (!period) throw new NotFoundException(`Payroll period with ID ${id} not found`);
    return period;
  }

  async update(id: string, data: Prisma.PayrollPeriodUpdateInput): Promise<PayrollPeriod> {
    await this.findOne(id);
    return this.prisma.payrollPeriod.update({ where: { id }, data });
  }

  async remove(id: string): Promise<PayrollPeriod> {
    const period = await this.findOne(id);
    if (period.status !== PayrollStatus.DRAFT) {
      throw new BadRequestException('Cannot delete non-draft payroll period');
    }
    return this.prisma.payrollPeriod.delete({ where: { id } });
  }

  async calculate(id: string): Promise<PayrollPeriod> {
    const period = await this.findOne(id);
    if (period.status !== PayrollStatus.DRAFT) {
      throw new BadRequestException('Can only calculate draft payroll');
    }

    // Calculate totals from items
    const items = await this.prisma.payrollItem.findMany({ where: { payrollPeriodId: id } });
    const totalGrossSalary = items.reduce((sum, item) => sum + item.grossSalary, 0);
    const totalAllowances = items.reduce((sum, item) => sum + item.totalAllowances, 0);
    const totalDeductions = items.reduce((sum, item) => sum + item.totalDeductions, 0);
    const totalNetSalary = items.reduce((sum, item) => sum + item.netSalary, 0);

    return this.prisma.payrollPeriod.update({
      where: { id },
      data: {
        totalGrossSalary,
        totalAllowances,
        totalDeductions,
        totalNetSalary,
        status: PayrollStatus.CALCULATED,
      },
    });
  }

  async approve(id: string): Promise<PayrollPeriod> {
    const period = await this.findOne(id);
    if (period.status !== PayrollStatus.CALCULATED) {
      throw new BadRequestException('Can only approve calculated payroll');
    }

    return this.prisma.payrollPeriod.update({
      where: { id },
      data: { status: PayrollStatus.APPROVED, approvedAt: new Date() },
    });
  }

  async post(id: string): Promise<PayrollPeriod> {
    const period = await this.findOne(id);
    if (period.status !== PayrollStatus.APPROVED) {
      throw new BadRequestException('Can only post approved payroll');
    }

    // Create journal entry
    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        entryNumber: `PAY-${period.year}-${period.month}`,
        entryDate: new Date(),
        description: `Payroll for ${period.year}-${period.month}`,
        type: 'PAYROLL' as any,
        status: 'POSTED' as any,
        totalDebit: period.totalNetSalary,
        totalCredit: period.totalNetSalary,
      },
    });

    return this.prisma.payrollPeriod.update({
      where: { id },
      data: {
        status: PayrollStatus.POSTED,
        postedAt: new Date(),
        journalEntryId: journalEntry.id,
      },
      include: { journalEntry: true },
    });
  }

  async close(id: string): Promise<PayrollPeriod> {
    const period = await this.findOne(id);
    if (period.status !== PayrollStatus.POSTED) {
      throw new BadRequestException('Can only close posted payroll');
    }

    return this.prisma.payrollPeriod.update({
      where: { id },
      data: { status: PayrollStatus.CLOSED, closedAt: new Date() },
    });
  }

  async count(where?: Prisma.PayrollPeriodWhereInput): Promise<number> {
    return this.prisma.payrollPeriod.count({ where });
  }
}
