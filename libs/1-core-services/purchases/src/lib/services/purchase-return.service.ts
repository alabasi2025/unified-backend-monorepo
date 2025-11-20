/**
 * SEMOP - Purchase Return Service
 * خدمة إدارة مرتجعات المشتريات
 * 
 * @module PurchaseReturnService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma, PurchaseReturnStatus } from '@prisma/client';

@Injectable()
export class PurchaseReturnService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء مرتجع مشتريات جديد
   */
  async create(data: {
    supplierId: string;
    returnDate: Date;
    purchaseInvoiceId?: string;
    lines: Array<{
      itemId: string;
      warehouseId: string;
      quantity: number;
      unitPrice: number;
      taxRate?: number;
      reason?: string;
    }>;
    holdingId?: string;
    unitId?: string;
    projectId?: string;
    notes?: string;
  }, userId?: string) {
    // التحقق من المورد
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: data.supplierId },
      include: { payableAccount: true },
    });
    if (!supplier || !supplier.isActive) {
      throw new NotFoundException('Supplier not found or not active');
    }

    // التحقق من الفاتورة إن وجدت
    if (data.purchaseInvoiceId) {
      const invoice = await this.prisma.purchaseInvoice.findUnique({
        where: { id: data.purchaseInvoiceId },
      });
      if (!invoice) {
        throw new NotFoundException('Purchase invoice not found');
      }
      if (invoice.status !== 'POSTED') {
        throw new BadRequestException('Can only return from posted invoices');
      }
    }

    // التحقق من السطور
    if (!data.lines || data.lines.length === 0) {
      throw new BadRequestException('Return must have at least one line');
    }

    // التحقق من الأصناف والمخازن والمخزون
    for (const line of data.lines) {
      const item = await this.prisma.item.findUnique({
        where: { id: line.itemId },
        include: { purchaseAccount: true, inventoryAccount: true },
      });
      if (!item || !item.isActive) {
        throw new NotFoundException(`Item ${line.itemId} not found or not active`);
      }

      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: line.warehouseId },
      });
      if (!warehouse || !warehouse.isActive) {
        throw new NotFoundException(`Warehouse ${line.warehouseId} not found or not active`);
      }

      // التحقق من المخزون المتاح
      if (item.isStockable) {
        const stockLevel = await this.prisma.stockLevel.findUnique({
          where: {
            itemId_warehouseId: {
              itemId: line.itemId,
              warehouseId: line.warehouseId,
            },
          },
        });
        if (!stockLevel || Number(stockLevel.availableQuantity) < line.quantity) {
          throw new BadRequestException(`Insufficient stock for item ${item.code} in warehouse ${warehouse.code}`);
        }
      }

      if (line.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than zero');
      }
      if (line.unitPrice < 0) {
        throw new BadRequestException('Unit price cannot be negative');
      }
    }

    // توليد رقم المرتجع
    const returnNumber = await this.generateReturnNumber();

    // حساب المجاميع
    let subtotal = 0;
    let taxAmount = 0;

    const linesData = data.lines.map((line, index) => {
      const lineTotal = line.quantity * line.unitPrice;
      const taxRate = line.taxRate ?? 15;
      const lineTaxAmount = lineTotal * (taxRate / 100);
      const lineNetAmount = lineTotal + lineTaxAmount;

      subtotal += lineTotal;
      taxAmount += lineTaxAmount;

      return {
        lineNumber: index + 1,
        itemId: line.itemId,
        warehouseId: line.warehouseId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxRate,
        lineTotal,
        taxAmount: lineTaxAmount,
        netAmount: lineNetAmount,
        reason: line.reason,
      };
    });

    const totalAmount = subtotal + taxAmount;

    return this.prisma.purchaseReturn.create({
      data: {
        returnNumber,
        returnDate: data.returnDate,
        status: 'DRAFT',
        supplier: { connect: { id: data.supplierId } },
        purchaseInvoice: data.purchaseInvoiceId ? { connect: { id: data.purchaseInvoiceId } } : undefined,
        subtotal,
        taxAmount,
        totalAmount,
        refundedAmount: 0,
        holdingId: data.holdingId,
        unitId: data.unitId,
        projectId: data.projectId,
        notes: data.notes,
        lines: { create: linesData },
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        supplier: true,
        purchaseInvoice: true,
        lines: { include: { item: true, warehouse: true } },
      },
    });
  }

  /**
   * توليد رقم مرتجع تلقائي
   */
  private async generateReturnNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastReturn = await this.prisma.purchaseReturn.findFirst({
      where: { returnNumber: { startsWith: `PR-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let sequence = 1;
    if (lastReturn) {
      const lastNumber = lastReturn.returnNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }
    return `PR-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * الحصول على جميع المرتجعات
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PurchaseReturnWhereInput;
    orderBy?: Prisma.PurchaseReturnOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [returns, total] = await Promise.all([
      this.prisma.purchaseReturn.findMany({
        skip, take, where,
        orderBy: orderBy || { returnDate: 'desc' },
        include: {
          supplier: { select: { id: true, code: true, nameEn: true, nameAr: true } },
          purchaseInvoice: { select: { id: true, invoiceNumber: true } },
          _count: { select: { lines: true } },
        },
      }),
      this.prisma.purchaseReturn.count({ where }),
    ]);
    return {
      data: returns, total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على مرتجع بالمعرف
   */
  async findOne(id: string) {
    const returnDoc = await this.prisma.purchaseReturn.findUnique({
      where: { id },
      include: {
        supplier: true,
        purchaseInvoice: true,
        journalEntry: true,
        lines: { include: { item: true, warehouse: true }, orderBy: { lineNumber: 'asc' } },
      },
    });
    if (!returnDoc) throw new NotFoundException(`Purchase return with ID ${id} not found`);
    return returnDoc;
  }

  /**
   * الحصول على مرتجع برقم المرتجع
   */
  async findByNumber(returnNumber: string) {
    const returnDoc = await this.prisma.purchaseReturn.findUnique({
      where: { returnNumber },
      include: {
        supplier: true,
        lines: { include: { item: true, warehouse: true } },
      },
    });
    if (!returnDoc) throw new NotFoundException(`Purchase return with number ${returnNumber} not found`);
    return returnDoc;
  }

  /**
   * ترحيل المرتجع (إنشاء قيد محاسبي وتحديث المخزون)
   */
  async post(id: string, userId?: string) {
    const returnDoc = await this.prisma.purchaseReturn.findUnique({
      where: { id },
      include: {
        supplier: { include: { payableAccount: true } },
        lines: { include: { item: { include: { purchaseAccount: true, inventoryAccount: true } }, warehouse: true } },
      },
    });

    if (!returnDoc) throw new NotFoundException('Purchase return not found');
    if (returnDoc.status !== 'DRAFT') throw new BadRequestException('Can only post draft returns');
    if (returnDoc.lines.length === 0) throw new BadRequestException('Cannot post return with no lines');

    // إنشاء قيد محاسبي
    const journalEntryNumber = await this.generateJournalEntryNumber();
    const journalEntryLines: any[] = [];

    // سطور المصروفات/المخزون (دائن)
    const itemAccountsMap = new Map<string, number>();
    for (const line of returnDoc.lines) {
      const accountId = line.item.isStockable 
        ? line.item.inventoryAccount!.id 
        : line.item.purchaseAccount!.id;
      
      const currentAmount = itemAccountsMap.get(accountId) || 0;
      itemAccountsMap.set(accountId, currentAmount + Number(line.netAmount));
    }

    itemAccountsMap.forEach((amount, accountId) => {
      journalEntryLines.push({
        accountId,
        debit: 0,
        credit: amount,
        description: `Purchase Return: ${returnDoc.returnNumber}`,
      });
    });

    // سطر الدائنين (مدين)
    journalEntryLines.push({
      accountId: returnDoc.supplier.payableAccount!.id,
      debit: Number(returnDoc.totalAmount),
      credit: 0,
      description: `Purchase Return: ${returnDoc.returnNumber} - ${returnDoc.supplier.nameEn}`,
    });

    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        entryNumber: journalEntryNumber,
        entryDate: returnDoc.returnDate,
        entryType: 'PURCHASE_RETURN',
        description: `Purchase Return: ${returnDoc.returnNumber}`,
        totalDebit: Number(returnDoc.totalAmount),
        totalCredit: Number(returnDoc.totalAmount),
        status: 'POSTED',
        lines: { create: journalEntryLines },
        createdBy: userId,
      },
    });

    // تحديث المخزون
    for (const line of returnDoc.lines) {
      if (line.item.isStockable) {
        // إنشاء حركة مخزون
        await this.prisma.stockMovement.create({
          data: {
            movementNumber: await this.generateStockMovementNumber(),
            movementDate: returnDoc.returnDate,
            movementType: 'RETURN_TO_SUPPLIER',
            item: { connect: { id: line.item.id } },
            warehouse: { connect: { id: line.warehouse.id } },
            quantity: Number(line.quantity),
            reference: `Purchase Return: ${returnDoc.returnNumber}`,
            createdBy: userId,
          },
        });

        // تحديث مستوى المخزون
        const stockLevel = await this.prisma.stockLevel.findUnique({
          where: {
            itemId_warehouseId: {
              itemId: line.item.id,
              warehouseId: line.warehouse.id,
            },
          },
        });

        if (stockLevel) {
          await this.prisma.stockLevel.update({
            where: {
              itemId_warehouseId: {
                itemId: line.item.id,
                warehouseId: line.warehouse.id,
              },
            },
            data: {
              quantity: Number(stockLevel.quantity) - Number(line.quantity),
              availableQuantity: Number(stockLevel.availableQuantity) - Number(line.quantity),
            },
          });
        }
      }
    }

    // تحديث حالة المرتجع
    return this.prisma.purchaseReturn.update({
      where: { id },
      data: {
        status: 'POSTED',
        postedAt: new Date(),
        postedBy: userId,
        journalEntry: { connect: { id: journalEntry.id } },
        updatedBy: userId,
      },
      include: {
        supplier: true,
        journalEntry: true,
        lines: { include: { item: true, warehouse: true } },
      },
    });
  }

  /**
   * توليد رقم قيد محاسبي
   */
  private async generateJournalEntryNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastEntry = await this.prisma.journalEntry.findFirst({
      where: { entryNumber: { startsWith: `JE-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let sequence = 1;
    if (lastEntry) {
      const lastNumber = lastEntry.entryNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }
    return `JE-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * توليد رقم حركة مخزون
   */
  private async generateStockMovementNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastMovement = await this.prisma.stockMovement.findFirst({
      where: { movementNumber: { startsWith: `RTS-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let sequence = 1;
    if (lastMovement) {
      const lastNumber = lastMovement.movementNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }
    return `RTS-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * تحديث مرتجع
   */
  async update(id: string, data: { notes?: string }, userId?: string) {
    const existing = await this.prisma.purchaseReturn.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Purchase return with ID ${id} not found`);
    if (existing.status !== 'DRAFT') throw new BadRequestException('Can only update draft returns');

    return this.prisma.purchaseReturn.update({
      where: { id },
      data: { ...data, updatedBy: userId },
      include: { supplier: true, lines: { include: { item: true, warehouse: true } } },
    });
  }

  /**
   * إلغاء مرتجع
   */
  async cancel(id: string, userId?: string) {
    const returnDoc = await this.prisma.purchaseReturn.findUnique({ where: { id } });
    if (!returnDoc) throw new NotFoundException('Purchase return not found');
    if (returnDoc.status === 'CANCELLED') throw new BadRequestException('Return is already cancelled');
    if (returnDoc.status === 'POSTED') throw new BadRequestException('Cannot cancel posted return');

    return this.prisma.purchaseReturn.update({
      where: { id },
      data: { status: 'CANCELLED', updatedBy: userId },
    });
  }

  /**
   * عد المرتجعات
   */
  async count(where?: Prisma.PurchaseReturnWhereInput) {
    return this.prisma.purchaseReturn.count({ where });
  }

  /**
   * الحصول على مرتجعات مورد
   */
  async getSupplierReturns(supplierId: string) {
    return this.prisma.purchaseReturn.findMany({
      where: { supplierId, status: 'POSTED' },
      include: {
        lines: { include: { item: true } },
      },
      orderBy: { returnDate: 'desc' },
    });
  }

  /**
   * الحصول على إحصائيات المرتجعات
   */
  async getStatistics(startDate?: Date, endDate?: Date) {
    const where: Prisma.PurchaseReturnWhereInput = {
      status: 'POSTED',
    };

    if (startDate || endDate) {
      where.returnDate = {};
      if (startDate) where.returnDate.gte = startDate;
      if (endDate) where.returnDate.lte = endDate;
    }

    const returns = await this.prisma.purchaseReturn.findMany({
      where,
      include: { lines: true },
    });

    const totalReturns = returns.length;
    const totalAmount = returns.reduce((sum, ret) => sum + Number(ret.totalAmount), 0);
    const totalItems = returns.reduce((sum, ret) => sum + ret.lines.length, 0);
    const totalQuantity = returns.reduce((sum, ret) => 
      sum + ret.lines.reduce((lineSum, line) => lineSum + Number(line.quantity), 0), 0
    );

    return {
      totalReturns,
      totalAmount,
      totalItems,
      totalQuantity,
      averageReturnValue: totalReturns > 0 ? totalAmount / totalReturns : 0,
    };
  }
}
