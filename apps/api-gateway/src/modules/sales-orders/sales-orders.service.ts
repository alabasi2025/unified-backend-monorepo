import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/multi-entity';
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto';

@Injectable()
export class SalesOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.salesOrder.findMany({
      include: {
        customer: true,
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });
    
    if (!order) {
      throw new NotFoundException(`Sales order with ID ${id} not found`);
    }
    
    return order;
  }

  async create(createDto: CreateSalesOrderDto) {
    return this.prisma.salesOrder.create({
      data: createDto as any,
      include: {
        customer: true,
      },
    });
  }

  async update(id: string, updateDto: UpdateSalesOrderDto) {
    await this.findOne(id);
    
    return this.prisma.salesOrder.update({
      where: { id },
      data: updateDto as any,
      include: {
        customer: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    
    return this.prisma.salesOrder.delete({
      where: { id },
    });
  }
}
