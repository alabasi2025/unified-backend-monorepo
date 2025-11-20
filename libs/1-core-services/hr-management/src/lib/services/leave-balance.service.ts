import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { LeaveBalance, Prisma } from '@prisma/client';

@Injectable()
export class LeaveBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LeaveBalanceCreateInput): Promise<LeaveBalance> {
    return this.prisma.leaveBalance.create({ data, include: { employee: true, leaveType: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.LeaveBalanceWhereInput; orderBy?: Prisma.LeaveBalanceOrderByWithRelationInput;
  }): Promise<{ data: LeaveBalance[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.leaveBalance.findMany({ skip, take, where, orderBy, include: { employee: true, leaveType: true } }),
      this.prisma.leaveBalance.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<LeaveBalance> {
    const balance = await this.prisma.leaveBalance.findUnique({ where: { id }, include: { employee: true, leaveType: true } });
    if (!balance) throw new NotFoundException(`Leave balance with ID ${id} not found`);
    return balance;
  }

  async findByEmployee(employeeId: string, year: number): Promise<LeaveBalance[]> {
    return this.prisma.leaveBalance.findMany({
      where: { employeeId, year },
      include: { leaveType: true },
    });
  }

  async findByEmployeeAndType(employeeId: string, leaveTypeId: string, year: number): Promise<LeaveBalance | null> {
    return this.prisma.leaveBalance.findFirst({
      where: { employeeId, leaveTypeId, year },
      include: { leaveType: true },
    });
  }

  async update(id: string, data: Prisma.LeaveBalanceUpdateInput): Promise<LeaveBalance> {
    await this.findOne(id);
    return this.prisma.leaveBalance.update({ where: { id }, data });
  }

  async remove(id: string): Promise<LeaveBalance> {
    await this.findOne(id);
    return this.prisma.leaveBalance.delete({ where: { id } });
  }

  async deductDays(id: string, days: number): Promise<LeaveBalance> {
    const balance = await this.findOne(id);
    const newUsedDays = balance.usedDays + days;
    const newRemainingDays = balance.totalDays - newUsedDays;

    return this.prisma.leaveBalance.update({
      where: { id },
      data: {
        usedDays: newUsedDays,
        remainingDays: newRemainingDays,
      },
    });
  }

  async addDays(id: string, days: number): Promise<LeaveBalance> {
    const balance = await this.findOne(id);
    const newTotalDays = balance.totalDays + days;
    const newRemainingDays = newTotalDays - balance.usedDays;

    return this.prisma.leaveBalance.update({
      where: { id },
      data: {
        totalDays: newTotalDays,
        remainingDays: newRemainingDays,
      },
    });
  }

  async resetForYear(employeeId: string, year: number): Promise<void> {
    const balances = await this.findByEmployee(employeeId, year);
    for (const balance of balances) {
      await this.prisma.leaveBalance.update({
        where: { id: balance.id },
        data: {
          usedDays: 0,
          remainingDays: balance.totalDays,
        },
      });
    }
  }

  async count(where?: Prisma.LeaveBalanceWhereInput): Promise<number> {
    return this.prisma.leaveBalance.count({ where });
  }
}
