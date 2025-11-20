import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { BonusType, Prisma } from '@prisma/client';

@Injectable()
export class BonusTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BonusTypeCreateInput): Promise<BonusType> {
    const existing = await this.prisma.bonusType.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Bonus type with code ${data.code} already exists`);
    return this.prisma.bonusType.create({ data });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.BonusTypeWhereInput; orderBy?: Prisma.BonusTypeOrderByWithRelationInput;
  }): Promise<{ data: BonusType[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.bonusType.findMany({ skip, take, where, orderBy }),
      this.prisma.bonusType.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<BonusType> {
    const type = await this.prisma.bonusType.findUnique({ where: { id } });
    if (!type) throw new NotFoundException(`Bonus type with ID ${id} not found`);
    return type;
  }

  async findByCode(code: string): Promise<BonusType> {
    const type = await this.prisma.bonusType.findUnique({ where: { code } });
    if (!type) throw new NotFoundException(`Bonus type with code ${code} not found`);
    return type;
  }

  async update(id: string, data: Prisma.BonusTypeUpdateInput): Promise<BonusType> {
    await this.findOne(id);
    return this.prisma.bonusType.update({ where: { id }, data });
  }

  async remove(id: string): Promise<BonusType> {
    await this.findOne(id);
    return this.prisma.bonusType.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string): Promise<BonusType> {
    await this.findOne(id);
    return this.prisma.bonusType.update({ where: { id }, data: { isActive: true } });
  }

  async count(where?: Prisma.BonusTypeWhereInput): Promise<number> {
    return this.prisma.bonusType.count({ where });
  }
}
