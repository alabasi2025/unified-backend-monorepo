import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { AllowanceType, Prisma } from '@prisma/client';

@Injectable()
export class AllowanceTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AllowanceTypeCreateInput): Promise<AllowanceType> {
    const existing = await this.prisma.allowanceType.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Allowance type with code ${data.code} already exists`);
    return this.prisma.allowanceType.create({ data });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.AllowanceTypeWhereInput; orderBy?: Prisma.AllowanceTypeOrderByWithRelationInput;
  }): Promise<{ data: AllowanceType[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.allowanceType.findMany({ skip, take, where, orderBy }),
      this.prisma.allowanceType.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<AllowanceType> {
    const type = await this.prisma.allowanceType.findUnique({ where: { id } });
    if (!type) throw new NotFoundException(`Allowance type with ID ${id} not found`);
    return type;
  }

  async findByCode(code: string): Promise<AllowanceType> {
    const type = await this.prisma.allowanceType.findUnique({ where: { code } });
    if (!type) throw new NotFoundException(`Allowance type with code ${code} not found`);
    return type;
  }

  async update(id: string, data: Prisma.AllowanceTypeUpdateInput): Promise<AllowanceType> {
    await this.findOne(id);
    return this.prisma.allowanceType.update({ where: { id }, data });
  }

  async remove(id: string): Promise<AllowanceType> {
    await this.findOne(id);
    return this.prisma.allowanceType.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string): Promise<AllowanceType> {
    await this.findOne(id);
    return this.prisma.allowanceType.update({ where: { id }, data: { isActive: true } });
  }

  async count(where?: Prisma.AllowanceTypeWhereInput): Promise<number> {
    return this.prisma.allowanceType.count({ where });
  }
}
