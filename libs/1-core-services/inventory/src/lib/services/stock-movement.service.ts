/**
 * SEMOP - Stock Movement Service
 * خدمة إدارة حركات المخزون
 * 
 * @module StockMovementService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma, StockMovementType } from '@prisma/client';

@Injectable()
export class StockMovementService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء حركة مخزون جديدة
   */
  async create(data: Prisma.StockMovementCreateInput, userId?: string) {
    // التحقق من وجود الصنف
    if (data.item?.connect?.id) {
      const item = await this.prisma.item.findUnique({
        where: { id: data.item.connect.id },
      });
      if (!item) {
        throw new NotFoundException('Item not found');
      }
      if (!item.isStockable) {
        throw new BadRequestException('Item is not stockable');
      }
    }

    // التحقق من وجود المخزن
    if (data.warehouse?.connect?.id) {
      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: data.warehouse.connect.id },
      });
      if (!warehouse) {
        throw new NotFoundException('Warehouse not found');
      }
      if (!warehouse.isActive) {
        throw new BadRequestException('Warehouse is not active');
      }
    }

    // التحقق من الكمية
    if (data.quantity && Number(data.quantity) <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    // توليد رقم الحركة
    const movementNumber = await this.generateMovementNumber(data.movementType as StockMovementType);

    // إنشاء الحركة
    const movement = await this.prisma.stockMovement.create({
      data: {
        ...data,
        movementNumber,
        createdBy: userId,
      },
      include: {
        item: true,
        warehouse: true,
      },
    });

    // تحديث مستوى المخزون
    await this.updateStockLevel(movement);

    return movement;
  }

  /**
   * توليد رقم حركة تلقائي
   */
  private async generateMovementNumber(movementType: StockMovementType): Promise<string> {
    const prefix = this.getMovementPrefix(movementType);
    const year = new Date().getFullYear();
    
    const lastMovement = await this.prisma.stockMovement.findFirst({
      where: {
        movementNumber: {
          startsWith: `${prefix}-${year}`,
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

    return `${prefix}-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * الحصول على بادئة رقم الحركة حسب النوع
   */
  private getMovementPrefix(movementType: StockMovementType): string {
    const prefixes: Record<StockMovementType, string> = {
      PURCHASE_RECEIPT: 'PR',
      SALES_ISSUE: 'SI',
      TRANSFER_IN: 'TI',
      TRANSFER_OUT: 'TO',
      ADJUSTMENT_IN: 'AI',
      ADJUSTMENT_OUT: 'AO',
      OPENING_BALANCE: 'OB',
      RETURN_FROM_CUSTOMER: 'RFC',
      RETURN_TO_SUPPLIER: 'RTS',
    };
    return prefixes[movementType] || 'SM';
  }

  /**
   * تحديث مستوى المخزون بناءً على الحركة
   */
  private async updateStockLevel(movement: any) {
    const itemId = movement.item.id;
    const warehouseId = movement.warehouse.id;
    const quantity = Number(movement.quantity);

    // الحصول على مستوى المخزون الحالي أو إنشاء واحد جديد
    let stockLevel = await this.prisma.stockLevel.findUnique({
      where: {
        itemId_warehouseId: {
          itemId,
          warehouseId,
        },
      },
    });

    if (!stockLevel) {
      stockLevel = await this.prisma.stockLevel.create({
        data: {
          itemId,
          warehouseId,
          quantity: 0,
          reservedQuantity: 0,
          availableQuantity: 0,
        },
      });
    }

    // تحديد التغيير في الكمية حسب نوع الحركة
    let quantityChange = 0;
    switch (movement.movementType) {
      case 'PURCHASE_RECEIPT':
      case 'TRANSFER_IN':
      case 'ADJUSTMENT_IN':
      case 'OPENING_BALANCE':
      case 'RETURN_FROM_CUSTOMER':
        quantityChange = quantity;
        break;
      case 'SALES_ISSUE':
      case 'TRANSFER_OUT':
      case 'ADJUSTMENT_OUT':
      case 'RETURN_TO_SUPPLIER':
        quantityChange = -quantity;
        break;
    }

    // تحديث المخزون
    const newQuantity = Number(stockLevel.quantity) + quantityChange;
    const newAvailable = Number(stockLevel.availableQuantity) + quantityChange;

    if (newQuantity < 0) {
      throw new BadRequestException('Insufficient stock quantity');
    }

    await this.prisma.stockLevel.update({
      where: {
        itemId_warehouseId: {
          itemId,
          warehouseId,
        },
      },
      data: {
        quantity: newQuantity,
        availableQuantity: newAvailable,
      },
    });
  }

  /**
   * الحصول على جميع الحركات مع فلاتر
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    const [movements, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { movementDate: 'desc' },
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
          warehouse: {
            select: {
              id: true,
              code: true,
              nameEn: true,
              nameAr: true,
            },
          },
        },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    return {
      data: movements,
      total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على حركة بالمعرف
   */
  async findOne(id: string) {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        item: true,
        warehouse: true,
      },
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }

    return movement;
  }

  /**
   * الحصول على حركة برقم الحركة
   */
  async findByNumber(movementNumber: string) {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { movementNumber },
      include: {
        item: true,
        warehouse: true,
      },
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement with number ${movementNumber} not found`);
    }

    return movement;
  }

  /**
   * الحصول على حركات صنف معين
   */
  async findByItem(itemId: string, params?: {
    skip?: number;
    take?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: Prisma.StockMovementWhereInput = {
      itemId,
    };

    if (params?.startDate || params?.endDate) {
      where.movementDate = {};
      if (params.startDate) {
        where.movementDate.gte = params.startDate;
      }
      if (params.endDate) {
        where.movementDate.lte = params.endDate;
      }
    }

    return this.findAll({
      skip: params?.skip,
      take: params?.take,
      where,
      orderBy: { movementDate: 'desc' },
    });
  }

  /**
   * الحصول على حركات مخزن معين
   */
  async findByWarehouse(warehouseId: string, params?: {
    skip?: number;
    take?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: Prisma.StockMovementWhereInput = {
      warehouseId,
    };

    if (params?.startDate || params?.endDate) {
      where.movementDate = {};
      if (params.startDate) {
        where.movementDate.gte = params.startDate;
      }
      if (params.endDate) {
        where.movementDate.lte = params.endDate;
      }
    }

    return this.findAll({
      skip: params?.skip,
      take: params?.take,
      where,
      orderBy: { movementDate: 'desc' },
    });
  }

  /**
   * عد الحركات
   */
  async count(where?: Prisma.StockMovementWhereInput) {
    return this.prisma.stockMovement.count({ where });
  }

  /**
   * إنشاء حركة تحويل بين مخزنين
   */
  async createTransfer(data: {
    itemId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
    movementDate: Date;
    reference?: string;
    notes?: string;
  }, userId?: string) {
    // التحقق من الصنف
    const item = await this.prisma.item.findUnique({
      where: { id: data.itemId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (!item.isStockable) {
      throw new BadRequestException('Item is not stockable');
    }

    // التحقق من المخازن
    const [fromWarehouse, toWarehouse] = await Promise.all([
      this.prisma.warehouse.findUnique({ where: { id: data.fromWarehouseId } }),
      this.prisma.warehouse.findUnique({ where: { id: data.toWarehouseId } }),
    ]);

    if (!fromWarehouse) {
      throw new NotFoundException('Source warehouse not found');
    }
    if (!toWarehouse) {
      throw new NotFoundException('Destination warehouse not found');
    }
    if (!fromWarehouse.isActive || !toWarehouse.isActive) {
      throw new BadRequestException('Both warehouses must be active');
    }
    if (data.fromWarehouseId === data.toWarehouseId) {
      throw new BadRequestException('Source and destination warehouses cannot be the same');
    }

    // التحقق من المخزون المتاح
    const stockLevel = await this.prisma.stockLevel.findUnique({
      where: {
        itemId_warehouseId: {
          itemId: data.itemId,
          warehouseId: data.fromWarehouseId,
        },
      },
    });

    if (!stockLevel || Number(stockLevel.availableQuantity) < data.quantity) {
      throw new BadRequestException('Insufficient stock in source warehouse');
    }

    // إنشاء حركتين: صادر من المخزن الأول ووارد للمخزن الثاني
    const transferRef = `TRANSFER-${Date.now()}`;

    const [outMovement, inMovement] = await Promise.all([
      this.create({
        item: { connect: { id: data.itemId } },
        warehouse: { connect: { id: data.fromWarehouseId } },
        movementDate: data.movementDate,
        movementType: 'TRANSFER_OUT',
        quantity: data.quantity,
        reference: data.reference || transferRef,
        notes: data.notes,
      }, userId),
      this.create({
        item: { connect: { id: data.itemId } },
        warehouse: { connect: { id: data.toWarehouseId } },
        movementDate: data.movementDate,
        movementType: 'TRANSFER_IN',
        quantity: data.quantity,
        reference: data.reference || transferRef,
        notes: data.notes,
      }, userId),
    ]);

    return {
      transferReference: transferRef,
      outMovement,
      inMovement,
    };
  }

  /**
   * إنشاء حركة تسوية
   */
  async createAdjustment(data: {
    itemId: string;
    warehouseId: string;
    adjustmentType: 'IN' | 'OUT';
    quantity: number;
    movementDate: Date;
    reason: string;
    notes?: string;
  }, userId?: string) {
    // التحقق من الصنف والمخزن
    const [item, warehouse] = await Promise.all([
      this.prisma.item.findUnique({ where: { id: data.itemId } }),
      this.prisma.warehouse.findUnique({ where: { id: data.warehouseId } }),
    ]);

    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    if (!item.isStockable) {
      throw new BadRequestException('Item is not stockable');
    }
    if (!warehouse.isActive) {
      throw new BadRequestException('Warehouse is not active');
    }

    // إذا كانت التسوية خصم، التحقق من المخزون المتاح
    if (data.adjustmentType === 'OUT') {
      const stockLevel = await this.prisma.stockLevel.findUnique({
        where: {
          itemId_warehouseId: {
            itemId: data.itemId,
            warehouseId: data.warehouseId,
          },
        },
      });

      if (!stockLevel || Number(stockLevel.availableQuantity) < data.quantity) {
        throw new BadRequestException('Insufficient stock for adjustment');
      }
    }

    return this.create({
      item: { connect: { id: data.itemId } },
      warehouse: { connect: { id: data.warehouseId } },
      movementDate: data.movementDate,
      movementType: data.adjustmentType === 'IN' ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT',
      quantity: data.quantity,
      reference: data.reason,
      notes: data.notes,
    }, userId);
  }
}
