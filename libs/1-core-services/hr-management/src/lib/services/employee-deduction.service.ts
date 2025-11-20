import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { EmployeeDeduction, Prisma } from '@prisma/client';

@Injectable()
export class EmployeeDeductionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EmployeeDeductionCreateInput): Promise<EmployeeDeduction> {
    return this.prisma.employeeDeduction.create({ data, include: { employee: true, deductionType: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.EmployeeDeductionWhereInput; orderBy?: Prisma.EmployeeDeductionOrderByWithRelationInput;
  }): Promise<{ data: EmployeeDeduction[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.employeeDeduction.findMany({ skip, take, where, orderBy, include: { employee: true, deductionType: true } }),
      this.prisma.employeeDeduction.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<EmployeeDeduction> {
    const deduction = await this.prisma.employeeDeduction.findUnique({ where: { id }, include: { employee: true, deductionType: true } });
    if (!deduction) throw new NotFoundException(`Employee deduction with ID ${id} not found`);
    return deduction;
  }

  async findByEmployee(employeeId: string): Promise<EmployeeDeduction[]> {
    return this.prisma.employeeDeduction.findMany({
      where: { employeeId, isActive: true },
      include: { deductionType: true },
    });
  }

  async update(id: string, data: Prisma.EmployeeDeductionUpdateInput): Promise<EmployeeDeduction> {
    await this.findOne(id);
    return this.prisma.employeeDeduction.update({ where: { id }, data });
  }

  async remove(id: string): Promise<EmployeeDeduction> {
    await this.findOne(id);
    return this.prisma.employeeDeduction.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string): Promise<EmployeeDeduction> {
    await this.findOne(id);
    return this.prisma.employeeDeduction.update({ where: { id }, data: { isActive: true } });
  }

  async count(where?: Prisma.EmployeeDeductionWhereInput): Promise<number> {
    return this.prisma.employeeDeduction.count({ where });
  }
}
