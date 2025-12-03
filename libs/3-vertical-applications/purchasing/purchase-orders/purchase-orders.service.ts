// /home/ubuntu/purchase_orders/src/purchase-orders.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service'; // افتراض مسار PrismaService
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrder } from '@prisma/client'; // افتراض أن Prisma Client تم توليده

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.prisma.purchaseOrder.create({
      data: {
        ...createPurchaseOrderDto,
        // تحويل orderDate إلى Date إذا كان موجودًا
        orderDate: createPurchaseOrderDto.orderDate ? new Date(createPurchaseOrderDto.orderDate) : undefined,
      },
    });
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.prisma.purchaseOrder.findMany();
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Purchase Order with ID "${id}" not found`);
    }

    return order;
  }

  async update(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    try {
      return await this.prisma.purchaseOrder.update({
        where: { id },
        data: {
          ...updatePurchaseOrderDto,
          // تحويل orderDate إلى Date إذا كان موجودًا
          orderDate: updatePurchaseOrderDto.orderDate ? new Date(updatePurchaseOrderDto.orderDate) : undefined,
        },
      });
    } catch (error) {
      // يمكن أن يكون الخطأ بسبب عدم وجود السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`Purchase Order with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<PurchaseOrder> {
    try {
      return await this.prisma.purchaseOrder.delete({
        where: { id },
      });
    } catch (error) {
      // يمكن أن يكون الخطأ بسبب عدم وجود السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`Purchase Order with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
