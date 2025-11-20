/**
 * SEMOP - Stock Count Service
 * خدمة إدارة الجرد
 * 
 * @module StockCountService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma, StockCountStatus } from '@prisma/client';

@Injectable()
export class StockCountService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء جرد جديد
   */
  async create(data: {
    warehouseId: string;
    countDate: Date;
    notes?: string;
  }, userId?: string) {
    // التحقق من وجود المخزن
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    if (!warehouse.isActive) {
      throw new BadRequestException('Warehouse is not active');
    }

    // توليد رقم الجرد
    const countNumber = await this.generateCountNumber();

    return this.prisma.stockCount.create({
      data: {
        countNumber,
        countDate: data.countDate,
        status: 'DRAFT',
        warehouse: {
          connect: { id: data.warehouseId },
        },
        notes: data.notes,
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        warehouse: true,
      },
    });
  }

  /**
   * توليد رقم جرد تلقائي
   */
  private async generateCountNumber(): Promise<string> {
    const year = new Date().getFullYear();
    
    const lastCount = await this.prisma.stockCount.findFirst({
      where: {
        countNumber: {
          startsWith: `SC-${year}`,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let sequence = 1;
    if (lastCount) {
      const lastNumber = lastCount.countNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }

    return `SC-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * الحصول على جميع الجرديات مع فلاتر
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.StockCountWhereInput;
    orderBy?: Prisma.StockCountOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    const [counts, total] = await Promise.all([
      this.prisma.stockCount.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { countDate: 'desc' },
        include: {
          warehouse: {
            select: {
              id: true,
              code: true,
              nameEn: true,
              nameAr: true,
            },
          },
          _count: {
            select: {
              lines: true,
            },
          },
        },
      }),
      this.prisma.stockCount.count({ where }),
    ]);

    return {
      data: counts,
      total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على جرد بالمعرف
   */
  async findOne(id: string) {
    const count = await this.prisma.stockCount.findUnique({
      where: { id },
      include: {
        warehouse: true,
        lines: {
          include: {
            item: {
              select: {
                id: true,
                code: true,
                nameEn: true,
                nameAr: true,
                unit: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!count) {
      throw new NotFoundException(`Stock count with ID ${id} not found`);
    }

    return count;
  }

  /**
   * الحصول على جرد برقم الجرد
   */
  async findByNumber(countNumber: string) {
    const count = await this.prisma.stockCount.findUnique({
      where: { countNumber },
      include: {
        warehouse: true,
        lines: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!count) {
      throw new NotFoundException(`Stock count with number ${countNumber} not found`);
    }

    return count;
  }

  /**
   * تحديث جرد
   */
  async update(id: string, data: Prisma.StockCountUpdateInput, userId?: string) {
    const existing = await this.prisma.stockCount.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Stock count with ID ${id} not found`);
    }

    if (existing.status === 'COMPLETED') {
      throw new BadRequestException('Cannot update completed stock count');
    }

    if (existing.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update cancelled stock count');
    }

    return this.prisma.stockCount.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
      include: {
        warehouse: true,
      },
    });
  }

  /**
   * إضافة سطر جرد
   */
  async addLine(stockCountId: string, data: {
    itemId: string;
    countedQuantity: number;
    notes?: string;
  }) {
    const stockCount = await this.prisma.stockCount.findUnique({
      where: { id: stockCountId },
    });

    if (!stockCount) {
      throw new NotFoundException('Stock count not found');
    }

    if (stockCount.status !== 'DRAFT' && stockCount.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Can only add lines to draft or in-progress stock counts');
    }

    // الحصول على الكمية الحالية في النظام
    const stockLevel = await this.prisma.stockLevel.findUnique({
      where: {
        itemId_warehouseId: {
          itemId: data.itemId,
          warehouseId: stockCount.warehouseId,
        },
      },
    });

    const systemQuantity = stockLevel ? Number(stockLevel.quantity) : 0;
    const countedQuantity = data.countedQuantity;
    const difference = countedQuantity - systemQuantity;

    return this.prisma.stockCountLine.create({
      data: {
        stockCount: {
          connect: { id: stockCountId },
        },
        item: {
          connect: { id: data.itemId },
        },
        systemQuantity,
        countedQuantity,
        difference,
        notes: data.notes,
      },
      include: {
        item: true,
      },
    });
  }

  /**
   * تحديث سطر جرد
   */
  async updateLine(lineId: string, data: {
    countedQuantity?: number;
    notes?: string;
  }) {
    const line = await this.prisma.stockCountLine.findUnique({
      where: { id: lineId },
      include: {
        stockCount: true,
      },
    });

    if (!line) {
      throw new NotFoundException('Stock count line not found');
    }

    if (line.stockCount.status !== 'DRAFT' && line.stockCount.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Can only update lines in draft or in-progress stock counts');
    }

    const countedQuantity = data.countedQuantity ?? Number(line.countedQuantity);
    const difference = countedQuantity - Number(line.systemQuantity);

    return this.prisma.stockCountLine.update({
      where: { id: lineId },
      data: {
        countedQuantity,
        difference,
        notes: data.notes,
      },
      include: {
        item: true,
      },
    });
  }

  /**
   * حذف سطر جرد
   */
  async removeLine(lineId: string) {
    const line = await this.prisma.stockCountLine.findUnique({
      where: { id: lineId },
      include: {
        stockCount: true,
      },
    });

    if (!line) {
      throw new NotFoundException('Stock count line not found');
    }

    if (line.stockCount.status !== 'DRAFT' && line.stockCount.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Can only delete lines from draft or in-progress stock counts');
    }

    return this.prisma.stockCountLine.delete({
      where: { id: lineId },
    });
  }

  /**
   * بدء الجرد (تغيير الحالة إلى IN_PROGRESS)
   */
  async start(id: string, userId?: string) {
    const stockCount = await this.prisma.stockCount.findUnique({
      where: { id },
    });

    if (!stockCount) {
      throw new NotFoundException('Stock count not found');
    }

    if (stockCount.status !== 'DRAFT') {
      throw new BadRequestException('Can only start draft stock counts');
    }

    return this.prisma.stockCount.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        updatedBy: userId,
      },
    });
  }

  /**
   * إكمال الجرد وتطبيق التسويات
   */
  async complete(id: string, userId?: string) {
    const stockCount = await this.prisma.stockCount.findUnique({
      where: { id },
      include: {
        lines: {
          include: {
            item: true,
          },
        },
        warehouse: true,
      },
    });

    if (!stockCount) {
      throw new NotFoundException('Stock count not found');
    }

    if (stockCount.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Can only complete in-progress stock counts');
    }

    if (stockCount.lines.length === 0) {
      throw new BadRequestException('Cannot complete stock count with no lines');
    }

    // تطبيق التسويات لكل سطر له فرق
    for (const line of stockCount.lines) {
      if (Number(line.difference) !== 0) {
        // إنشاء حركة تسوية
        const movementType = Number(line.difference) > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT';
        const quantity = Math.abs(Number(line.difference));

        await this.prisma.stockMovement.create({
          data: {
            movementNumber: await this.generateAdjustmentNumber(),
            movementDate: stockCount.countDate,
            movementType,
            item: {
              connect: { id: line.item.id },
            },
            warehouse: {
              connect: { id: stockCount.warehouse.id },
            },
            quantity,
            reference: `Stock Count: ${stockCount.countNumber}`,
            notes: line.notes,
            createdBy: userId,
          },
        });

        // تحديث مستوى المخزون
        await this.prisma.stockLevel.update({
          where: {
            itemId_warehouseId: {
              itemId: line.item.id,
              warehouseId: stockCount.warehouse.id,
            },
          },
          data: {
            quantity: Number(line.countedQuantity),
            availableQuantity: Number(line.countedQuantity),
          },
        });
      }
    }

    return this.prisma.stockCount.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        completedBy: userId,
        updatedBy: userId,
      },
      include: {
        warehouse: true,
        lines: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  /**
   * توليد رقم تسوية
   */
  private async generateAdjustmentNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastMovement = await this.prisma.stockMovement.findFirst({
      where: {
        movementNumber: {
          startsWith: `ADJ-${year}`,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let sequence = 1;
    if (lastMovement) {
      const lastNumber = lastMovement.movementNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }

    return `ADJ-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * إلغاء الجرد
   */
  async cancel(id: string, userId?: string) {
    const stockCount = await this.prisma.stockCount.findUnique({
      where: { id },
    });

    if (!stockCount) {
      throw new NotFoundException('Stock count not found');
    }

    if (stockCount.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed stock count');
    }

    if (stockCount.status === 'CANCELLED') {
      throw new BadRequestException('Stock count is already cancelled');
    }

    return this.prisma.stockCount.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updatedBy: userId,
      },
    });
  }

  /**
   * عد الجرديات
   */
  async count(where?: Prisma.StockCountWhereInput) {
    return this.prisma.stockCount.count({ where });
  }
}
