import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { OvertimeRequest, Prisma, ApprovalStatus } from '@prisma/client';

@Injectable()
export class OvertimeRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.OvertimeRequestCreateInput): Promise<OvertimeRequest> {
    return this.prisma.overtimeRequest.create({ data, include: { employee: true, approvedBy: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.OvertimeRequestWhereInput; orderBy?: Prisma.OvertimeRequestOrderByWithRelationInput;
  }): Promise<{ data: OvertimeRequest[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.overtimeRequest.findMany({ skip, take, where, orderBy, include: { employee: true, approvedBy: true } }),
      this.prisma.overtimeRequest.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<OvertimeRequest> {
    const request = await this.prisma.overtimeRequest.findUnique({ where: { id }, include: { employee: true, approvedBy: true } });
    if (!request) throw new NotFoundException(`Overtime request with ID ${id} not found`);
    return request;
  }

  async findByEmployee(employeeId: string): Promise<OvertimeRequest[]> {
    return this.prisma.overtimeRequest.findMany({ where: { employeeId }, orderBy: { date: 'desc' } });
  }

  async findPending(): Promise<OvertimeRequest[]> {
    return this.prisma.overtimeRequest.findMany({
      where: { status: ApprovalStatus.PENDING },
      include: { employee: { include: { department: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, data: Prisma.OvertimeRequestUpdateInput): Promise<OvertimeRequest> {
    await this.findOne(id);
    return this.prisma.overtimeRequest.update({ where: { id }, data });
  }

  async remove(id: string): Promise<OvertimeRequest> {
    await this.findOne(id);
    return this.prisma.overtimeRequest.delete({ where: { id } });
  }

  async approve(id: string, approvedById: string): Promise<OvertimeRequest> {
    await this.findOne(id);
    return this.prisma.overtimeRequest.update({
      where: { id },
      data: {
        status: ApprovalStatus.APPROVED,
        approvedById,
        approvedAt: new Date(),
      },
      include: { employee: true, approvedBy: true },
    });
  }

  async reject(id: string, approvedById: string, rejectionReason?: string): Promise<OvertimeRequest> {
    await this.findOne(id);
    return this.prisma.overtimeRequest.update({
      where: { id },
      data: {
        status: ApprovalStatus.REJECTED,
        approvedById,
        approvedAt: new Date(),
        rejectionReason,
      },
      include: { employee: true, approvedBy: true },
    });
  }

  async count(where?: Prisma.OvertimeRequestWhereInput): Promise<number> {
    return this.prisma.overtimeRequest.count({ where });
  }
}
