import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { LeaveType, Prisma } from '@prisma/client';

@Injectable()
export class LeaveTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LeaveTypeCreateInput): Promise<LeaveType> {
    const existing = await this.prisma.leaveType.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Leave type with code ${data.code} already exists`);
    return this.prisma.leaveType.create({ data });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.LeaveTypeWhereInput; orderBy?: Prisma.LeaveTypeOrderByWithRelationInput;
  }): Promise<{ data: LeaveType[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.leaveType.findMany({ skip, take, where, orderBy }),
      this.prisma.leaveType.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<LeaveType> {
    const leaveType = await this.prisma.leaveType.findUnique({ where: { id } });
    if (!leaveType) throw new NotFoundException(`Leave type with ID ${id} not found`);
    return leaveType;
  }

  async findByCode(code: string): Promise<LeaveType> {
    const leaveType = await this.prisma.leaveType.findUnique({ where: { code } });
    if (!leaveType) throw new NotFoundException(`Leave type with code ${code} not found`);
    return leaveType;
  }

  async update(id: string, data: Prisma.LeaveTypeUpdateInput): Promise<LeaveType> {
    await this.findOne(id);
    return this.prisma.leaveType.update({ where: { id }, data });
  }

  async remove(id: string): Promise<LeaveType> {
    await this.findOne(id);
    return this.prisma.leaveType.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string): Promise<LeaveType> {
    await this.findOne(id);
    return this.prisma.leaveType.update({ where: { id }, data: { isActive: true } });
  }

  async count(where?: Prisma.LeaveTypeWhereInput): Promise<number> {
    return this.prisma.leaveType.count({ where });
  }
}
