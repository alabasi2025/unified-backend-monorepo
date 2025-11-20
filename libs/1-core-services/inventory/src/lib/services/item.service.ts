/**
 * SEMOP - Item Service
 * خدمة إدارة الأصناف
 * 
 * @module ItemService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma, ItemType } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء صنف جديد
   */
  async create(data: Prisma.ItemCreateInput, userId?: string) {
    // التحقق من عدم تكرار الكود
    const existingByCode = await this.prisma.item.findUnique({
      where: { code: data.code },
    });
    if (existingByCode) {
      throw new ConflictException(`Item with code ${data.code} already exists`);
    }

    // التحقق من عدم تكرار الباركود
    if (data.barcode) {
      const existingByBarcode = await this.prisma.item.findUnique({
        where: { barcode: data.barcode },
      });
      if (existingByBarcode) {
        throw new ConflictException(`Item with barcode ${data.barcode} already exists`);
      }
    }

    // التحقق من وجود الفئة
    if (data.category?.connect?.id) {
      const category = await this.prisma.itemCategory.findUnique({
        where: { id: data.category.connect.id },
      });
      if (!category) {
        throw new NotFoundException('Item category not found');
      }
      if (!category.isActive) {
        throw new BadRequestException('Item category is not active');
      }
    }

    // التحقق من الحسابات المحاسبية
    if (data.salesAccount?.connect?.id) {
      const account = await this.prisma.account.findUnique({
        where: { id: data.salesAccount.connect.id },
      });
      if (!account || !account.isActive) {
        throw new BadRequestException('Sales account not found or inactive');
      }
    }

    if (data.purchaseAccount?.connect?.id) {
      const account = await this.prisma.account.findUnique({
        where: { id: data.purchaseAccount.connect.id },
      });
      if (!account || !account.isActive) {
        throw new BadRequestException('Purchase account not found or inactive');
      }
    }

    if (data.inventoryAccount?.connect?.id) {
      const account = await this.prisma.account.findUnique({
        where: { id: data.inventoryAccount.connect.id },
      });
      if (!account || !account.isActive) {
        throw new BadRequestException('Inventory account not found or inactive');
      }
    }

    // التحقق من الأسعار
    if (data.sellingPrice && data.minSellingPrice && Number(data.minSellingPrice) > Number(data.sellingPrice)) {
      throw new BadRequestException('Minimum selling price cannot be greater than selling price');
    }

    return this.prisma.item.create({
      data: {
        ...data,
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        category: true,
        salesAccount: true,
        purchaseAccount: true,
        inventoryAccount: true,
      },
    });
  }

  /**
   * الحصول على جميع الأصناف مع فلاتر
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
    include?: Prisma.ItemInclude;
  }) {
    const { skip, take, where, orderBy, include } = params;

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: include || {
          category: true,
          salesAccount: { select: { id: true, code: true, nameEn: true } },
          purchaseAccount: { select: { id: true, code: true, nameEn: true } },
          inventoryAccount: { select: { id: true, code: true, nameEn: true } },
        },
      }),
      this.prisma.item.count({ where }),
    ]);

    return {
      data: items,
      total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على صنف بالمعرف
   */
  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        salesAccount: true,
        purchaseAccount: true,
        inventoryAccount: true,
        stockLevels: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  /**
   * الحصول على صنف بالكود
   */
  async findByCode(code: string) {
    const item = await this.prisma.item.findUnique({
      where: { code },
      include: {
        category: true,
        salesAccount: true,
        purchaseAccount: true,
        inventoryAccount: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with code ${code} not found`);
    }

    return item;
  }

  /**
   * الحصول على صنف بالباركود
   */
  async findByBarcode(barcode: string) {
    const item = await this.prisma.item.findUnique({
      where: { barcode },
      include: {
        category: true,
        salesAccount: true,
        purchaseAccount: true,
        inventoryAccount: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with barcode ${barcode} not found`);
    }

    return item;
  }

  /**
   * تحديث صنف
   */
  async update(id: string, data: Prisma.ItemUpdateInput, userId?: string) {
    // التحقق من وجود الصنف
    const existing = await this.prisma.item.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // التحقق من عدم تكرار الكود
    if (data.code && data.code !== existing.code) {
      const existingByCode = await this.prisma.item.findUnique({
        where: { code: data.code as string },
      });
      if (existingByCode) {
        throw new ConflictException(`Item with code ${data.code} already exists`);
      }
    }

    // التحقق من عدم تكرار الباركود
    if (data.barcode && data.barcode !== existing.barcode) {
      const existingByBarcode = await this.prisma.item.findUnique({
        where: { barcode: data.barcode as string },
      });
      if (existingByBarcode) {
        throw new ConflictException(`Item with barcode ${data.barcode} already exists`);
      }
    }

    return this.prisma.item.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
      include: {
        category: true,
        salesAccount: true,
        purchaseAccount: true,
        inventoryAccount: true,
      },
    });
  }

  /**
   * حذف صنف (Soft Delete)
   */
  async remove(id: string, userId?: string) {
    // التحقق من وجود الصنف
    const existing = await this.prisma.item.findUnique({
      where: { id },
      include: {
        stockLevels: true,
        purchaseOrderLines: true,
        salesOrderLines: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // التحقق من عدم وجود مخزون
    const hasStock = existing.stockLevels.some(level => Number(level.quantity) > 0);
    if (hasStock) {
      throw new BadRequestException('Cannot delete item with existing stock. Deactivate instead.');
    }

    // التحقق من عدم وجود طلبات
    if (existing.purchaseOrderLines.length > 0 || existing.salesOrderLines.length > 0) {
      throw new BadRequestException('Cannot delete item with existing orders. Deactivate instead.');
    }

    return this.prisma.item.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: userId,
      },
    });
  }

  /**
   * تفعيل صنف
   */
  async activate(id: string, userId?: string) {
    const existing = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return this.prisma.item.update({
      where: { id },
      data: {
        isActive: true,
        updatedBy: userId,
      },
    });
  }

  /**
   * عد الأصناف
   */
  async count(where?: Prisma.ItemWhereInput) {
    return this.prisma.item.count({ where });
  }

  /**
   * الحصول على مخزون الصنف في جميع المخازن
   */
  async getStock(itemId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: {
        stockLevels: {
          include: {
            warehouse: {
              select: {
                id: true,
                code: true,
                nameEn: true,
                nameAr: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const totalQuantity = item.stockLevels.reduce(
      (sum, level) => sum + Number(level.quantity),
      0
    );
    const totalReserved = item.stockLevels.reduce(
      (sum, level) => sum + Number(level.reservedQuantity),
      0
    );
    const totalAvailable = item.stockLevels.reduce(
      (sum, level) => sum + Number(level.availableQuantity),
      0
    );

    return {
      itemId: item.id,
      itemCode: item.code,
      itemName: item.nameEn,
      unit: item.unit,
      totalQuantity,
      totalReserved,
      totalAvailable,
      reorderLevel: item.reorderLevel ? Number(item.reorderLevel) : null,
      maxStockLevel: item.maxStockLevel ? Number(item.maxStockLevel) : null,
      needsReorder: item.reorderLevel ? totalAvailable < Number(item.reorderLevel) : false,
      warehouses: item.stockLevels.map(level => ({
        warehouseId: level.warehouse.id,
        warehouseCode: level.warehouse.code,
        warehouseName: level.warehouse.nameEn,
        quantity: Number(level.quantity),
        reserved: Number(level.reservedQuantity),
        available: Number(level.availableQuantity),
      })),
    };
  }

  /**
   * الحصول على الأصناف التي تحتاج إعادة طلب
   */
  async getItemsNeedingReorder() {
    const items = await this.prisma.item.findMany({
      where: {
        isActive: true,
        reorderLevel: { not: null },
      },
      include: {
        stockLevels: true,
        category: true,
      },
    });

    const itemsNeedingReorder = items.filter(item => {
      const totalAvailable = item.stockLevels.reduce(
        (sum, level) => sum + Number(level.availableQuantity),
        0
      );
      return item.reorderLevel && totalAvailable < Number(item.reorderLevel);
    });

    return itemsNeedingReorder.map(item => {
      const totalAvailable = item.stockLevels.reduce(
        (sum, level) => sum + Number(level.availableQuantity),
        0
      );
      return {
        id: item.id,
        code: item.code,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        category: item.category?.nameEn,
        unit: item.unit,
        currentStock: totalAvailable,
        reorderLevel: Number(item.reorderLevel),
        shortage: Number(item.reorderLevel) - totalAvailable,
      };
    });
  }

  /**
   * تحديث أسعار الصنف
   */
  async updatePrices(
    itemId: string,
    prices: {
      costPrice?: number;
      sellingPrice?: number;
      minSellingPrice?: number;
    },
    userId?: string
  ) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    // التحقق من الأسعار
    const newSellingPrice = prices.sellingPrice ?? Number(item.sellingPrice);
    const newMinSellingPrice = prices.minSellingPrice ?? (item.minSellingPrice ? Number(item.minSellingPrice) : null);

    if (newMinSellingPrice && newMinSellingPrice > newSellingPrice) {
      throw new BadRequestException('Minimum selling price cannot be greater than selling price');
    }

    return this.prisma.item.update({
      where: { id: itemId },
      data: {
        costPrice: prices.costPrice,
        sellingPrice: prices.sellingPrice,
        minSellingPrice: prices.minSellingPrice,
        updatedBy: userId,
      },
    });
  }
}
