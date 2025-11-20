import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { EmployeeAllowance, Prisma } from '@prisma/client';

@Injectable()
export class EmployeeAllowanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EmployeeAllowanceCreateInput): Promise<EmployeeAllowance> {
    return this.prisma.employeeAllowance.create({ data, include: { employee: true, allowanceType: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.EmployeeAllowanceWhereInput; orderBy?: Prisma.EmployeeAllowanceOrderByWithRelationInput;
  }): Promise<{ data: EmployeeAllowance[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.employeeAllowance.findMany({ skip, take, where, orderBy, include: { employee: true, allowanceType: true } }),
      this.prisma.employeeAllowance.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<EmployeeAllowance> {
    const allowance = await this.prisma.employeeAllowance.findUnique({ where: { id }, include: { employee: true, allowanceType: true } });
    if (!allowance) throw new NotFoundException(`Employee allowance with ID ${id} not found`);
    return allowance;
  }

  async findByEmployee(employeeId: string): Promise<EmployeeAllowance[]> {
    return this.prisma.employeeAllowance.findMany({
      where: { employeeId, isActive: true },
      include: { allowanceType: true },
    });
  }

  async update(id: string, data: Prisma.EmployeeAllowanceUpdateInput): Promise<EmployeeAllowance> {
    await this.findOne(id);
    return this.prisma.employeeAllowance.update({ where: { id }, data });
  }

  async remove(id: string): Promise<EmployeeAllowance> {
    await this.findOne(id);
    return this.prisma.employeeAllowance.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string): Promise<EmployeeAllowance> {
    await this.findOne(id);
    return this.prisma.employeeAllowance.update({ where: { id }, data: { isActive: true } });
  }

  async count(where?: Prisma.EmployeeAllowanceWhereInput): Promise<number> {
    return this.prisma.employeeAllowance.count({ where });
  }
}
