import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { Shift, Prisma } from '@prisma/client';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ShiftCreateInput): Promise<Shift> {
    const existing = await this.prisma.shift.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Shift with code ${data.code} already exists`);
    return this.prisma.shift.create({ data });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.ShiftWhereInput; orderBy?: Prisma.ShiftOrderByWithRelationInput;
  }): Promise<{ data: Shift[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.shift.findMany({ skip, take, where, orderBy }),
      this.prisma.shift.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<Shift> {
    const shift = await this.prisma.shift.findUnique({ where: { id } });
    if (!shift) throw new NotFoundException(`Shift with ID ${id} not found`);
    return shift;
  }

  async findByCode(code: string): Promise<Shift> {
    const shift = await this.prisma.shift.findUnique({ where: { code } });
    if (!shift) throw new NotFoundException(`Shift with code ${code} not found`);
    return shift;
  }

  async update(id: string, data: Prisma.ShiftUpdateInput): Promise<Shift> {
    await this.findOne(id);
    return this.prisma.shift.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Shift> {
    await this.findOne(id);
    return this.prisma.shift.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string): Promise<Shift> {
    await this.findOne(id);
    return this.prisma.shift.update({ where: { id }, data: { isActive: true } });
  }

  async count(where?: Prisma.ShiftWhereInput): Promise<number> {
    return this.prisma.shift.count({ where });
  }
}
