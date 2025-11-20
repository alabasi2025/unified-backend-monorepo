import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { PayrollItem, Prisma } from '@prisma/client';

@Injectable()
export class PayrollItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PayrollItemCreateInput): Promise<PayrollItem> {
    return this.prisma.payrollItem.create({ data, include: { employee: true, payrollPeriod: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.PayrollItemWhereInput; orderBy?: Prisma.PayrollItemOrderByWithRelationInput;
  }): Promise<{ data: PayrollItem[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.payrollItem.findMany({ skip, take, where, orderBy, include: { employee: true, payrollPeriod: true } }),
      this.prisma.payrollItem.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<PayrollItem> {
    const item = await this.prisma.payrollItem.findUnique({
      where: { id },
      include: {
        employee: true,
        payrollPeriod: true,
        allowances: true,
        deductions: true,
        bonuses: true,
      },
    });
    if (!item) throw new NotFoundException(`Payroll item with ID ${id} not found`);
    return item;
  }

  async findByPeriod(payrollPeriodId: string): Promise<PayrollItem[]> {
    return this.prisma.payrollItem.findMany({
      where: { payrollPeriodId },
      include: { employee: { include: { department: true } } },
      orderBy: { employee: { code: 'asc' } },
    });
  }

  async findByEmployee(employeeId: string): Promise<PayrollItem[]> {
    return this.prisma.payrollItem.findMany({
      where: { employeeId },
      include: { payrollPeriod: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Prisma.PayrollItemUpdateInput): Promise<PayrollItem> {
    await this.findOne(id);
    return this.prisma.payrollItem.update({ where: { id }, data });
  }

  async remove(id: string): Promise<PayrollItem> {
    await this.findOne(id);
    return this.prisma.payrollItem.delete({ where: { id } });
  }

  async calculate(id: string): Promise<PayrollItem> {
    const item = await this.findOne(id);

    const allowances = await this.prisma.payrollAllowance.findMany({ where: { payrollItemId: id } });
    const deductions = await this.prisma.payrollDeduction.findMany({ where: { payrollItemId: id } });
    const bonuses = await this.prisma.payrollBonus.findMany({ where: { payrollItemId: id } });

    const totalAllowances = allowances.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const totalBonuses = bonuses.reduce((sum, b) => sum + b.amount, 0);
    const netSalary = item.grossSalary + totalAllowances + totalBonuses - totalDeductions;

    return this.prisma.payrollItem.update({
      where: { id },
      data: {
        totalAllowances,
        totalDeductions,
        totalBonuses,
        netSalary,
      },
    });
  }

  async count(where?: Prisma.PayrollItemWhereInput): Promise<number> {
    return this.prisma.payrollItem.count({ where });
  }
}
