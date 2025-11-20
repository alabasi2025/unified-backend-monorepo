import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { PayrollDeduction, Prisma } from '@prisma/client';

@Injectable()
export class PayrollDeductionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PayrollDeductionCreateInput): Promise<PayrollDeduction> {
    return this.prisma.payrollDeduction.create({ data, include: { payrollItem: true, deductionType: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.PayrollDeductionWhereInput; orderBy?: Prisma.PayrollDeductionOrderByWithRelationInput;
  }): Promise<{ data: PayrollDeduction[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.payrollDeduction.findMany({ skip, take, where, orderBy, include: { payrollItem: true, deductionType: true } }),
      this.prisma.payrollDeduction.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<PayrollDeduction> {
    const deduction = await this.prisma.payrollDeduction.findUnique({ where: { id }, include: { payrollItem: true, deductionType: true } });
    if (!deduction) throw new NotFoundException(`Payroll deduction with ID ${id} not found`);
    return deduction;
  }

  async update(id: string, data: Prisma.PayrollDeductionUpdateInput): Promise<PayrollDeduction> {
    await this.findOne(id);
    return this.prisma.payrollDeduction.update({ where: { id }, data });
  }

  async remove(id: string): Promise<PayrollDeduction> {
    await this.findOne(id);
    return this.prisma.payrollDeduction.delete({ where: { id } });
  }

  async count(where?: Prisma.PayrollDeductionWhereInput): Promise<number> {
    return this.prisma.payrollDeduction.count({ where });
  }
}
