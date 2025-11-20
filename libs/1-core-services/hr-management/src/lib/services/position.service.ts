import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { Position, Prisma, PositionLevel, PositionCategory } from '@prisma/client';

@Injectable()
export class PositionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PositionCreateInput): Promise<Position> {
    const existing = await this.prisma.position.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      throw new ConflictException(`Position with code ${data.code} already exists`);
    }

    return this.prisma.position.create({
      data,
      include: { employees: { take: 5 } },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.PositionWhereInput;
    orderBy?: Prisma.PositionOrderByWithRelationInput;
  }): Promise<{ data: Position[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};

    const [data, total] = await Promise.all([
      this.prisma.position.findMany({
        skip,
        take,
        where,
        orderBy,
        include: { employees: { take: 5 } },
      }),
      this.prisma.position.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.prisma.position.findUnique({
      where: { id },
      include: {
        employees: {
          take: 20,
          include: { department: true },
        },
      },
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    return position;
  }

  async findByCode(code: string): Promise<Position> {
    const position = await this.prisma.position.findUnique({
      where: { code },
      include: { employees: true },
    });

    if (!position) {
      throw new NotFoundException(`Position with code ${code} not found`);
    }

    return position;
  }

  async update(id: string, data: Prisma.PositionUpdateInput): Promise<Position> {
    await this.findOne(id);

    if (data.code) {
      const existing = await this.prisma.position.findFirst({
        where: {
          code: data.code as string,
          NOT: { id },
        },
      });
      if (existing) {
        throw new ConflictException(`Position with code ${data.code} already exists`);
      }
    }

    return this.prisma.position.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Position> {
    await this.findOne(id);

    const employeesCount = await this.prisma.employee.count({
      where: { positionId: id },
    });
    if (employeesCount > 0) {
      return this.prisma.position.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return this.prisma.position.delete({ where: { id } });
  }

  async activate(id: string): Promise<Position> {
    await this.findOne(id);
    return this.prisma.position.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string): Promise<Position> {
    await this.findOne(id);
    return this.prisma.position.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getByLevel(level: PositionLevel): Promise<Position[]> {
    return this.prisma.position.findMany({
      where: { level, isActive: true },
      orderBy: { titleEn: 'asc' },
    });
  }

  async getByCategory(category: PositionCategory): Promise<Position[]> {
    return this.prisma.position.findMany({
      where: { category, isActive: true },
      orderBy: { titleEn: 'asc' },
    });
  }

  async getEmployeeCount(id: string): Promise<number> {
    await this.findOne(id);
    return this.prisma.employee.count({
      where: { positionId: id },
    });
  }

  async search(query: string): Promise<Position[]> {
    return this.prisma.position.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { titleEn: { contains: query, mode: 'insensitive' } },
          { titleAr: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: 20,
    });
  }

  async count(where?: Prisma.PositionWhereInput): Promise<number> {
    return this.prisma.position.count({ where });
  }
}
