import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { EmployeeContract, Prisma, ContractStatus } from '@prisma/client';

@Injectable()
export class EmployeeContractService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EmployeeContractCreateInput): Promise<EmployeeContract> {
    const existing = await this.prisma.employeeContract.findUnique({ where: { contractNumber: data.contractNumber } });
    if (existing) throw new ConflictException(`Contract with number ${data.contractNumber} already exists`);
    return this.prisma.employeeContract.create({ data, include: { employee: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.EmployeeContractWhereInput; orderBy?: Prisma.EmployeeContractOrderByWithRelationInput;
  }): Promise<{ data: EmployeeContract[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.employeeContract.findMany({ skip, take, where, orderBy, include: { employee: true } }),
      this.prisma.employeeContract.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<EmployeeContract> {
    const contract = await this.prisma.employeeContract.findUnique({ where: { id }, include: { employee: true } });
    if (!contract) throw new NotFoundException(`Contract with ID ${id} not found`);
    return contract;
  }

  async findByEmployee(employeeId: string): Promise<EmployeeContract[]> {
    return this.prisma.employeeContract.findMany({ where: { employeeId }, orderBy: { startDate: 'desc' } });
  }

  async findActiveByEmployee(employeeId: string): Promise<EmployeeContract | null> {
    return this.prisma.employeeContract.findFirst({
      where: { employeeId, status: ContractStatus.ACTIVE, isActive: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async update(id: string, data: Prisma.EmployeeContractUpdateInput): Promise<EmployeeContract> {
    await this.findOne(id);
    return this.prisma.employeeContract.update({ where: { id }, data });
  }

  async remove(id: string): Promise<EmployeeContract> {
    await this.findOne(id);
    return this.prisma.employeeContract.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string): Promise<EmployeeContract> {
    await this.findOne(id);
    return this.prisma.employeeContract.update({ where: { id }, data: { status: ContractStatus.ACTIVE, isActive: true } });
  }

  async terminate(id: string): Promise<EmployeeContract> {
    await this.findOne(id);
    return this.prisma.employeeContract.update({ where: { id }, data: { status: ContractStatus.TERMINATED, endDate: new Date() } });
  }

  async getExpiringContracts(days: number): Promise<EmployeeContract[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return this.prisma.employeeContract.findMany({
      where: {
        endDate: { lte: futureDate, gte: new Date() },
        status: ContractStatus.ACTIVE,
      },
      include: { employee: true },
      orderBy: { endDate: 'asc' },
    });
  }

  async count(where?: Prisma.EmployeeContractWhereInput): Promise<number> {
    return this.prisma.employeeContract.count({ where });
  }
}
