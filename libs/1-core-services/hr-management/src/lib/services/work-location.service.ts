import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { WorkLocation, Prisma } from '@prisma/client';

@Injectable()
export class WorkLocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.WorkLocationCreateInput): Promise<WorkLocation> {
    const existing = await this.prisma.workLocation.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException(`Work location with code ${data.code} already exists`);
    return this.prisma.workLocation.create({ data, include: { holding: true, unit: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.WorkLocationWhereInput; orderBy?: Prisma.WorkLocationOrderByWithRelationInput;
  }): Promise<{ data: WorkLocation[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.workLocation.findMany({ skip, take, where, orderBy, include: { holding: true, unit: true, employees: { take: 5 } } }),
      this.prisma.workLocation.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<WorkLocation> {
    const location = await this.prisma.workLocation.findUnique({
      where: { id },
      include: { holding: true, unit: true, employees: { take: 20 } },
    });
    if (!location) throw new NotFoundException(`Work location with ID ${id} not found`);
    return location;
  }

  async findByCode(code: string): Promise<WorkLocation> {
    const location = await this.prisma.workLocation.findUnique({ where: { code }, include: { employees: true } });
    if (!location) throw new NotFoundException(`Work location with code ${code} not found`);
    return location;
  }

  async update(id: string, data: Prisma.WorkLocationUpdateInput): Promise<WorkLocation> {
    await this.findOne(id);
    if (data.code) {
      const existing = await this.prisma.workLocation.findFirst({ where: { code: data.code as string, NOT: { id } } });
      if (existing) throw new ConflictException(`Work location with code ${data.code} already exists`);
    }
    return this.prisma.workLocation.update({ where: { id }, data });
  }

  async remove(id: string): Promise<WorkLocation> {
    await this.findOne(id);
    return this.prisma.workLocation.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string): Promise<WorkLocation> {
    await this.findOne(id);
    return this.prisma.workLocation.update({ where: { id }, data: { isActive: true } });
  }

  async deactivate(id: string): Promise<WorkLocation> {
    await this.findOne(id);
    return this.prisma.workLocation.update({ where: { id }, data: { isActive: false } });
  }

  async getEmployeeCount(id: string): Promise<number> {
    await this.findOne(id);
    return this.prisma.employee.count({ where: { workLocationId: id } });
  }

  async search(query: string): Promise<WorkLocation[]> {
    return this.prisma.workLocation.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { nameEn: { contains: query, mode: 'insensitive' } },
          { nameAr: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: 20,
    });
  }

  async count(where?: Prisma.WorkLocationWhereInput): Promise<number> {
    return this.prisma.workLocation.count({ where });
  }
}
