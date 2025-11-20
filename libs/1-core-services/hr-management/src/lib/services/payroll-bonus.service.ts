import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { PayrollBonus, Prisma } from '@prisma/client';

@Injectable()
export class PayrollBonusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PayrollBonusCreateInput): Promise<PayrollBonus> {
    return this.prisma.payrollBonus.create({ data, include: { payrollItem: true, bonusType: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.PayrollBonusWhereInput; orderBy?: Prisma.PayrollBonusOrderByWithRelationInput;
  }): Promise<{ data: PayrollBonus[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.payrollBonus.findMany({ skip, take, where, orderBy, include: { payrollItem: true, bonusType: true } }),
      this.prisma.payrollBonus.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<PayrollBonus> {
    const bonus = await this.prisma.payrollBonus.findUnique({ where: { id }, include: { payrollItem: true, bonusType: true } });
    if (!bonus) throw new NotFoundException(`Payroll bonus with ID ${id} not found`);
    return bonus;
  }

  async update(id: string, data: Prisma.PayrollBonusUpdateInput): Promise<PayrollBonus> {
    await this.findOne(id);
    return this.prisma.payrollBonus.update({ where: { id }, data });
  }

  async remove(id: string): Promise<PayrollBonus> {
    await this.findOne(id);
    return this.prisma.payrollBonus.delete({ where: { id } });
  }

  async count(where?: Prisma.PayrollBonusWhereInput): Promise<number> {
    return this.prisma.payrollBonus.count({ where });
  }
}
