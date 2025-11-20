import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { EmployeeShift, Prisma } from '@prisma/client';

@Injectable()
export class EmployeeShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EmployeeShiftCreateInput): Promise<EmployeeShift> {
    return this.prisma.employeeShift.create({ data, include: { employee: true, shift: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.EmployeeShiftWhereInput; orderBy?: Prisma.EmployeeShiftOrderByWithRelationInput;
  }): Promise<{ data: EmployeeShift[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.employeeShift.findMany({ skip, take, where, orderBy, include: { employee: true, shift: true } }),
      this.prisma.employeeShift.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<EmployeeShift> {
    const employeeShift = await this.prisma.employeeShift.findUnique({ where: { id }, include: { employee: true, shift: true } });
    if (!employeeShift) throw new NotFoundException(`Employee shift with ID ${id} not found`);
    return employeeShift;
  }

  async findByEmployee(employeeId: string): Promise<EmployeeShift[]> {
    return this.prisma.employeeShift.findMany({ where: { employeeId }, include: { shift: true }, orderBy: { effectiveDate: 'desc' } });
  }

  async findCurrentByEmployee(employeeId: string): Promise<EmployeeShift | null> {
    const now = new Date();
    return this.prisma.employeeShift.findFirst({
      where: {
        employeeId,
        effectiveDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      include: { shift: true },
      orderBy: { effectiveDate: 'desc' },
    });
  }

  async update(id: string, data: Prisma.EmployeeShiftUpdateInput): Promise<EmployeeShift> {
    await this.findOne(id);
    return this.prisma.employeeShift.update({ where: { id }, data });
  }

  async remove(id: string): Promise<EmployeeShift> {
    await this.findOne(id);
    return this.prisma.employeeShift.delete({ where: { id } });
  }

  async count(where?: Prisma.EmployeeShiftWhereInput): Promise<number> {
    return this.prisma.employeeShift.count({ where });
  }
}
