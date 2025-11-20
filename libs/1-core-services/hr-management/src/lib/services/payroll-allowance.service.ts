import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { PayrollAllowance, Prisma } from '@prisma/client';

@Injectable()
export class PayrollAllowanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PayrollAllowanceCreateInput): Promise<PayrollAllowance> {
    return this.prisma.payrollAllowance.create({ data, include: { payrollItem: true, allowanceType: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.PayrollAllowanceWhereInput; orderBy?: Prisma.PayrollAllowanceOrderByWithRelationInput;
  }): Promise<{ data: PayrollAllowance[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.payrollAllowance.findMany({ skip, take, where, orderBy, include: { payrollItem: true, allowanceType: true } }),
      this.prisma.payrollAllowance.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<PayrollAllowance> {
    const allowance = await this.prisma.payrollAllowance.findUnique({ where: { id }, include: { payrollItem: true, allowanceType: true } });
    if (!allowance) throw new NotFoundException(`Payroll allowance with ID ${id} not found`);
    return allowance;
  }

  async update(id: string, data: Prisma.PayrollAllowanceUpdateInput): Promise<PayrollAllowance> {
    await this.findOne(id);
    return this.prisma.payrollAllowance.update({ where: { id }, data });
  }

  async remove(id: string): Promise<PayrollAllowance> {
    await this.findOne(id);
    return this.prisma.payrollAllowance.delete({ where: { id } });
  }

  async count(where?: Prisma.PayrollAllowanceWhereInput): Promise<number> {
    return this.prisma.payrollAllowance.count({ where });
  }
}
