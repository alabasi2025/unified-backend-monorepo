import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { LeaveRequest, Prisma, ApprovalStatus } from '@prisma/client';

@Injectable()
export class LeaveRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LeaveRequestCreateInput): Promise<LeaveRequest> {
    return this.prisma.leaveRequest.create({ data, include: { employee: true, leaveType: true, approvedBy: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.LeaveRequestWhereInput; orderBy?: Prisma.LeaveRequestOrderByWithRelationInput;
  }): Promise<{ data: LeaveRequest[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.leaveRequest.findMany({ skip, take, where, orderBy, include: { employee: true, leaveType: true, approvedBy: true } }),
      this.prisma.leaveRequest.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const request = await this.prisma.leaveRequest.findUnique({ where: { id }, include: { employee: true, leaveType: true, approvedBy: true } });
    if (!request) throw new NotFoundException(`Leave request with ID ${id} not found`);
    return request;
  }

  async findByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    return this.prisma.leaveRequest.findMany({
      where: { employeeId },
      include: { leaveType: true, approvedBy: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending(): Promise<LeaveRequest[]> {
    return this.prisma.leaveRequest.findMany({
      where: { status: ApprovalStatus.PENDING },
      include: { employee: { include: { department: true } }, leaveType: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, data: Prisma.LeaveRequestUpdateInput): Promise<LeaveRequest> {
    await this.findOne(id);
    return this.prisma.leaveRequest.update({ where: { id }, data });
  }

  async remove(id: string): Promise<LeaveRequest> {
    await this.findOne(id);
    return this.prisma.leaveRequest.delete({ where: { id } });
  }

  async approve(id: string, approvedById: string): Promise<LeaveRequest> {
    const request = await this.findOne(id);

    // Check leave balance
    const balance = await this.prisma.leaveBalance.findFirst({
      where: {
        employeeId: request.employeeId,
        leaveTypeId: request.leaveTypeId,
        year: request.startDate.getFullYear(),
      },
    });

    if (balance && balance.remainingDays < request.totalDays) {
      throw new BadRequestException('Insufficient leave balance');
    }

    // Deduct from balance
    if (balance) {
      await this.prisma.leaveBalance.update({
        where: { id: balance.id },
        data: {
          usedDays: balance.usedDays + request.totalDays,
          remainingDays: balance.remainingDays - request.totalDays,
        },
      });
    }

    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: ApprovalStatus.APPROVED,
        approvedById,
        approvedAt: new Date(),
      },
      include: { employee: true, leaveType: true, approvedBy: true },
    });
  }

  async reject(id: string, approvedById: string, rejectionReason?: string): Promise<LeaveRequest> {
    await this.findOne(id);
    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: ApprovalStatus.REJECTED,
        approvedById,
        approvedAt: new Date(),
        rejectionReason,
      },
      include: { employee: true, leaveType: true, approvedBy: true },
    });
  }

  async cancel(id: string): Promise<LeaveRequest> {
    const request = await this.findOne(id);

    if (request.status === ApprovalStatus.APPROVED) {
      // Restore leave balance
      const balance = await this.prisma.leaveBalance.findFirst({
        where: {
          employeeId: request.employeeId,
          leaveTypeId: request.leaveTypeId,
          year: request.startDate.getFullYear(),
        },
      });

      if (balance) {
        await this.prisma.leaveBalance.update({
          where: { id: balance.id },
          data: {
            usedDays: balance.usedDays - request.totalDays,
            remainingDays: balance.remainingDays + request.totalDays,
          },
        });
      }
    }

    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: ApprovalStatus.CANCELLED },
    });
  }

  async count(where?: Prisma.LeaveRequestWhereInput): Promise<number> {
    return this.prisma.leaveRequest.count({ where });
  }
}
