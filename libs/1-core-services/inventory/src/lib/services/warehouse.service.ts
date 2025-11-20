/**
 * SEMOP - Warehouse Service
 * خدمة إدارة المخازن
 * 
 * @module WarehouseService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء مخزن جديد
   */
  async create(data: Prisma.WarehouseCreateInput, userId?: string) {
    // التحقق من عدم تكرار الكود
    const existing = await this.prisma.warehouse.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new ConflictException(`Warehouse with code ${data.code} already exists`);
    }

    return this.prisma.warehouse.create({
      data: {
        ...data,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  /**
   * الحصول على جميع المخازن مع فلاتر
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.WarehouseWhereInput;
    orderBy?: Prisma.WarehouseOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [warehouses, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              stockLevels: true,
              stockMovements: true,
            },
          },
        },
      }),
      this.prisma.warehouse.count({ where }),
    ]);

    return {
      data: warehouses,
      total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على مخزن بالمعرف
   */
  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        stockLevels: {
          take: 20,
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
            quantity: 'desc',
          },
        },
        _count: {
          select: {
            stockLevels: true,
            stockMovements: true,
            stockCounts: true,
          },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return warehouse;
  }

  /**
   * الحصول على مخزن بالكود
   */
  async findByCode(code: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { code },
      include: {
        _count: {
          select: {
            stockLevels: true,
            stockMovements: true,
          },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with code ${code} not found`);
    }

    return warehouse;
  }

  /**
   * تحديث مخزن
   */
  async update(id: string, data: Prisma.WarehouseUpdateInput, userId?: string) {
    const existing = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    // التحقق من عدم تكرار الكود
    if (data.code && data.code !== existing.code) {
      const existingByCode = await this.prisma.warehouse.findUnique({
        where: { code: data.code as string },
      });
      if (existingByCode) {
        throw new ConflictException(`Warehouse with code ${data.code} already exists`);
      }
    }

    return this.prisma.warehouse.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
    });
  }

  /**
   * حذف مخزن (Soft Delete)
   */
  async remove(id: string, userId?: string) {
    const existing = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        stockLevels: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    // التحقق من عدم وجود مخزون
    const hasStock = existing.stockLevels.some(level => Number(level.quantity) > 0);
    if (hasStock) {
      throw new BadRequestException('Cannot delete warehouse with existing stock. Deactivate instead.');
    }

    return this.prisma.warehouse.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: userId,
      },
    });
  }

  /**
   * تفعيل مخزن
   */
  async activate(id: string, userId?: string) {
    const existing = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return this.prisma.warehouse.update({
      where: { id },
      data: {
        isActive: true,
        updatedBy: userId,
      },
    });
  }

  /**
   * عد المخازن
   */
  async count(where?: Prisma.WarehouseWhereInput) {
    return this.prisma.warehouse.count({ where });
  }

  /**
   * الحصول على إحصائيات المخزن
   */
  async getStatistics(warehouseId: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
      include: {
        stockLevels: {
          include: {
            item: true,
          },
        },
        stockMovements: {
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

    const totalItems = warehouse.stockLevels.length;
    const totalQuantity = warehouse.stockLevels.reduce(
      (sum, level) => sum + Number(level.quantity),
      0
    );
    const totalValue = warehouse.stockLevels.reduce(
      (sum, level) => sum + (Number(level.quantity) * Number(level.item.costPrice)),
      0
    );
    const itemsNeedingReorder = warehouse.stockLevels.filter(level => {
      return level.item.reorderLevel && Number(level.availableQuantity) < Number(level.item.reorderLevel);
    }).length;

    const movementsLast30Days = warehouse.stockMovements.length;
    const receiptsLast30Days = warehouse.stockMovements.filter(
      m => m.movementType === 'PURCHASE_RECEIPT' || m.movementType === 'TRANSFER_IN'
    ).length;
    const issuesLast30Days = warehouse.stockMovements.filter(
      m => m.movementType === 'SALES_ISSUE' || m.movementType === 'TRANSFER_OUT'
    ).length;

    return {
      warehouseId: warehouse.id,
      warehouseCode: warehouse.code,
      warehouseName: warehouse.nameEn,
      totalItems,
      totalQuantity,
      totalValue,
      itemsNeedingReorder,
      activity: {
        movementsLast30Days,
        receiptsLast30Days,
        issuesLast30Days,
      },
    };
  }

  /**
   * الحصول على مخزون المخزن (جميع الأصناف)
   */
  async getInventory(warehouseId: string, params?: {
    skip?: number;
    take?: number;
    itemCode?: string;
    categoryId?: string;
  }) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

    const where: Prisma.StockLevelWhereInput = {
      warehouseId,
    };

    if (params?.itemCode) {
      where.item = {
        code: {
          contains: params.itemCode,
          mode: 'insensitive',
        },
      };
    }

    if (params?.categoryId) {
      where.item = {
        ...where.item,
        categoryId: params.categoryId,
      };
    }

    const [stockLevels, total] = await Promise.all([
      this.prisma.stockLevel.findMany({
        where,
        skip: params?.skip,
        take: params?.take,
        include: {
          item: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          quantity: 'desc',
        },
      }),
      this.prisma.stockLevel.count({ where }),
    ]);

    return {
      warehouseId,
      warehouseCode: warehouse.code,
      warehouseName: warehouse.nameEn,
      data: stockLevels.map(level => ({
        itemId: level.item.id,
        itemCode: level.item.code,
        itemName: level.item.nameEn,
        category: level.item.category?.nameEn,
        unit: level.item.unit,
        quantity: Number(level.quantity),
        reserved: Number(level.reservedQuantity),
        available: Number(level.availableQuantity),
        costPrice: Number(level.item.costPrice),
        value: Number(level.quantity) * Number(level.item.costPrice),
      })),
      total,
      page: params?.skip && params?.take ? Math.floor(params.skip / params.take) + 1 : 1,
      pageSize: params?.take || total,
      totalPages: params?.take ? Math.ceil(total / params.take) : 1,
    };
  }
}
