import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { LoanRequest, Prisma, ApprovalStatus, LoanStatus } from '@prisma/client';

@Injectable()
export class LoanRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LoanRequestCreateInput): Promise<LoanRequest> {
    return this.prisma.loanRequest.create({ data, include: { employee: true, approvedBy: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.LoanRequestWhereInput; orderBy?: Prisma.LoanRequestOrderByWithRelationInput;
  }): Promise<{ data: LoanRequest[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.loanRequest.findMany({ skip, take, where, orderBy, include: { employee: true, approvedBy: true } }),
      this.prisma.loanRequest.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<LoanRequest> {
    const loan = await this.prisma.loanRequest.findUnique({ where: { id }, include: { employee: true, approvedBy: true } });
    if (!loan) throw new NotFoundException(`Loan request with ID ${id} not found`);
    return loan;
  }

  async findByEmployee(employeeId: string): Promise<LoanRequest[]> {
    return this.prisma.loanRequest.findMany({
      where: { employeeId },
      include: { approvedBy: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending(): Promise<LoanRequest[]> {
    return this.prisma.loanRequest.findMany({
      where: { approvalStatus: ApprovalStatus.PENDING },
      include: { employee: { include: { department: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, data: Prisma.LoanRequestUpdateInput): Promise<LoanRequest> {
    await this.findOne(id);
    return this.prisma.loanRequest.update({ where: { id }, data });
  }

  async remove(id: string): Promise<LoanRequest> {
    await this.findOne(id);
    return this.prisma.loanRequest.delete({ where: { id } });
  }

  async approve(id: string, approvedById: string): Promise<LoanRequest> {
    await this.findOne(id);
    return this.prisma.loanRequest.update({
      where: { id },
      data: {
        approvalStatus: ApprovalStatus.APPROVED,
        loanStatus: LoanStatus.ACTIVE,
        approvedById,
        approvedAt: new Date(),
      },
      include: { employee: true, approvedBy: true },
    });
  }

  async reject(id: string, approvedById: string, rejectionReason?: string): Promise<LoanRequest> {
    await this.findOne(id);
    return this.prisma.loanRequest.update({
      where: { id },
      data: {
        approvalStatus: ApprovalStatus.REJECTED,
        loanStatus: LoanStatus.REJECTED,
        approvedById,
        approvedAt: new Date(),
        rejectionReason,
      },
      include: { employee: true, approvedBy: true },
    });
  }

  async recordPayment(id: string, amount: number): Promise<LoanRequest> {
    const loan = await this.findOne(id);

    if (loan.loanStatus !== LoanStatus.ACTIVE) {
      throw new BadRequestException('Can only record payment for active loans');
    }

    const newPaidAmount = loan.paidAmount + amount;
    const newRemainingAmount = loan.totalAmount - newPaidAmount;
    const loanStatus = newRemainingAmount <= 0 ? LoanStatus.PAID : LoanStatus.ACTIVE;

    return this.prisma.loanRequest.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        loanStatus,
      },
    });
  }

  async count(where?: Prisma.LoanRequestWhereInput): Promise<number> {
    return this.prisma.loanRequest.count({ where });
  }
}
