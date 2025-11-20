import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { DeductionType, Prisma } from '@prisma/client';

@Injectable()
export class DeductionTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.DeductionTypeCreateInput): Promise<DeductionType> {
    const existing = await this.prisma.deductionType.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Deduction type with code ${data.code} already exists`);
    return this.prisma.deductionType.create({ data });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.DeductionTypeWhereInput; orderBy?: Prisma.DeductionTypeOrderByWithRelationInput;
  }): Promise<{ data: DeductionType[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.deductionType.findMany({ skip, take, where, orderBy }),
      this.prisma.deductionType.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<DeductionType> {
    const type = await this.prisma.deductionType.findUnique({ where: { id } });
    if (!type) throw new NotFoundException(`Deduction type with ID ${id} not found`);
    return type;
  }

  async findByCode(code: string): Promise<DeductionType> {
    const type = await this.prisma.deductionType.findUnique({ where: { code } });
    if (!type) throw new NotFoundException(`Deduction type with code ${code} not found`);
    return type;
  }

  async update(id: string, data: Prisma.DeductionTypeUpdateInput): Promise<DeductionType> {
    await this.findOne(id);
    return this.prisma.deductionType.update({ where: { id }, data });
  }

  async remove(id: string): Promise<DeductionType> {
    await this.findOne(id);
    return this.prisma.deductionType.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string): Promise<DeductionType> {
    await this.findOne(id);
    return this.prisma.deductionType.update({ where: { id }, data: { isActive: true } });
  }

  async count(where?: Prisma.DeductionTypeWhereInput): Promise<number> {
    return this.prisma.deductionType.count({ where });
  }
}
