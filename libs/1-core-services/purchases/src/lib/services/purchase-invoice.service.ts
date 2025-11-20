/**
 * SEMOP - Purchase Invoice Service
 * خدمة إدارة فواتير الشراء
 * 
 * @module PurchaseInvoiceService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma, PurchaseInvoiceStatus } from '@prisma/client';

@Injectable()
export class PurchaseInvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء فاتورة شراء جديدة
   */
  async create(data: {
    supplierId: string;
    invoiceDate: Date;
    dueDate?: Date;
    purchaseOrderId?: string;
    lines: Array<{
      itemId: string;
      warehouseId: string;
      quantity: number;
      unitPrice: number;
      taxRate?: number;
      discountRate?: number;
      description?: string;
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
    if (!supplier.payableAccount) {
      throw new BadRequestException('Supplier does not have a payable account');
    }

    // التحقق من طلب الشراء إن وجد
    let purchaseOrder = null;
    if (data.purchaseOrderId) {
      purchaseOrder = await this.prisma.purchaseOrder.findUnique({
        where: { id: data.purchaseOrderId },
        include: { lines: true },
      });
      if (!purchaseOrder) {
        throw new NotFoundException('Purchase order not found');
      }
      if (purchaseOrder.status !== 'APPROVED') {
        throw new BadRequestException('Purchase order must be approved');
      }
    }

    // التحقق من السطور
    if (!data.lines || data.lines.length === 0) {
      throw new BadRequestException('Invoice must have at least one line');
    }

    // التحقق من الأصناف والمخازن
    for (const line of data.lines) {
      const item = await this.prisma.item.findUnique({
        where: { id: line.itemId },
        include: { purchaseAccount: true, inventoryAccount: true },
      });
      if (!item || !item.isActive) {
        throw new NotFoundException(`Item ${line.itemId} not found or not active`);
      }
      if (!item.purchaseAccount) {
        throw new BadRequestException(`Item ${item.code} does not have a purchase account`);
      }
      if (item.isStockable && !item.inventoryAccount) {
        throw new BadRequestException(`Item ${item.code} does not have an inventory account`);
      }

      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: line.warehouseId },
      });
      if (!warehouse || !warehouse.isActive) {
        throw new NotFoundException(`Warehouse ${line.warehouseId} not found or not active`);
      }

      if (line.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than zero');
      }
      if (line.unitPrice < 0) {
        throw new BadRequestException('Unit price cannot be negative');
      }
    }

    // توليد رقم الفاتورة
    const invoiceNumber = await this.generateInvoiceNumber();

    // حساب المجاميع
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    const linesData = data.lines.map((line, index) => {
      const lineTotal = line.quantity * line.unitPrice;
      const taxRate = line.taxRate ?? 15;
      const discountRate = line.discountRate ?? 0;
      
      const lineDiscountAmount = lineTotal * (discountRate / 100);
      const lineTaxAmount = (lineTotal - lineDiscountAmount) * (taxRate / 100);
      const lineNetAmount = lineTotal - lineDiscountAmount + lineTaxAmount;

      subtotal += lineTotal;
      taxAmount += lineTaxAmount;
      discountAmount += lineDiscountAmount;

      return {
        lineNumber: index + 1,
        itemId: line.itemId,
        warehouseId: line.warehouseId,
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxRate,
        discountRate,
        lineTotal,
        taxAmount: lineTaxAmount,
        discountAmount: lineDiscountAmount,
        netAmount: lineNetAmount,
      };
    });

    const totalAmount = subtotal - discountAmount + taxAmount;

    // إنشاء الفاتورة
    const invoice = await this.prisma.purchaseInvoice.create({
      data: {
        invoiceNumber,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        status: 'DRAFT',
        supplier: { connect: { id: data.supplierId } },
        purchaseOrder: data.purchaseOrderId ? { connect: { id: data.purchaseOrderId } } : undefined,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        paidAmount: 0,
        remainingAmount: totalAmount,
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
        purchaseOrder: true,
        lines: { include: { item: true, warehouse: true } },
      },
    });

    return invoice;
  }

  /**
   * توليد رقم فاتورة تلقائي
   */
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastInvoice = await this.prisma.purchaseInvoice.findFirst({
      where: { invoiceNumber: { startsWith: `PI-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let sequence = 1;
    if (lastInvoice) {
      const lastNumber = lastInvoice.invoiceNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }
    return `PI-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * الحصول على جميع الفواتير
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PurchaseInvoiceWhereInput;
    orderBy?: Prisma.PurchaseInvoiceOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [invoices, total] = await Promise.all([
      this.prisma.purchaseInvoice.findMany({
        skip, take, where,
        orderBy: orderBy || { invoiceDate: 'desc' },
        include: {
          supplier: { select: { id: true, code: true, nameEn: true, nameAr: true } },
          purchaseOrder: { select: { id: true, orderNumber: true } },
          _count: { select: { lines: true, payments: true } },
        },
      }),
      this.prisma.purchaseInvoice.count({ where }),
    ]);
    return {
      data: invoices, total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على فاتورة بالمعرف
   */
  async findOne(id: string) {
    const invoice = await this.prisma.purchaseInvoice.findUnique({
      where: { id },
      include: {
        supplier: true,
        purchaseOrder: true,
        journalEntry: true,
        lines: { include: { item: true, warehouse: true }, orderBy: { lineNumber: 'asc' } },
        payments: { orderBy: { paymentDate: 'desc' } },
      },
    });
    if (!invoice) throw new NotFoundException(`Purchase invoice with ID ${id} not found`);
    return invoice;
  }

  /**
   * الحصول على فاتورة برقم الفاتورة
   */
  async findByNumber(invoiceNumber: string) {
    const invoice = await this.prisma.purchaseInvoice.findUnique({
      where: { invoiceNumber },
      include: {
        supplier: true,
        lines: { include: { item: true, warehouse: true } },
      },
    });
    if (!invoice) throw new NotFoundException(`Purchase invoice with number ${invoiceNumber} not found`);
    return invoice;
  }

  /**
   * ترحيل الفاتورة (إنشاء قيد محاسبي وتحديث المخزون)
   */
  async post(id: string, userId?: string) {
    const invoice = await this.prisma.purchaseInvoice.findUnique({
      where: { id },
      include: {
        supplier: { include: { payableAccount: true } },
        lines: { include: { item: { include: { purchaseAccount: true, inventoryAccount: true } }, warehouse: true } },
      },
    });

    if (!invoice) throw new NotFoundException('Purchase invoice not found');
    if (invoice.status !== 'DRAFT') throw new BadRequestException('Can only post draft invoices');
    if (invoice.lines.length === 0) throw new BadRequestException('Cannot post invoice with no lines');

    // إنشاء قيد محاسبي
    const journalEntryNumber = await this.generateJournalEntryNumber();
    const journalEntryLines: any[] = [];

    // سطور المصروفات/المخزون (مدين)
    const itemAccountsMap = new Map<string, number>();
    for (const line of invoice.lines) {
      const accountId = line.item.isStockable 
        ? line.item.inventoryAccount!.id 
        : line.item.purchaseAccount!.id;
      
      const currentAmount = itemAccountsMap.get(accountId) || 0;
      itemAccountsMap.set(accountId, currentAmount + Number(line.netAmount));
    }

    itemAccountsMap.forEach((amount, accountId) => {
      journalEntryLines.push({
        accountId,
        debit: amount,
        credit: 0,
        description: `Purchase Invoice: ${invoice.invoiceNumber}`,
      });
    });

    // سطر الدائنين (دائن)
    journalEntryLines.push({
      accountId: invoice.supplier.payableAccount!.id,
      debit: 0,
      credit: Number(invoice.totalAmount),
      description: `Purchase Invoice: ${invoice.invoiceNumber} - ${invoice.supplier.nameEn}`,
    });

    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        entryNumber: journalEntryNumber,
        entryDate: invoice.invoiceDate,
        entryType: 'PURCHASE',
        description: `Purchase Invoice: ${invoice.invoiceNumber}`,
        totalDebit: Number(invoice.totalAmount),
        totalCredit: Number(invoice.totalAmount),
        status: 'POSTED',
        lines: { create: journalEntryLines },
        createdBy: userId,
      },
    });

    // تحديث المخزون
    for (const line of invoice.lines) {
      if (line.item.isStockable) {
        // إنشاء حركة مخزون
        await this.prisma.stockMovement.create({
          data: {
            movementNumber: await this.generateStockMovementNumber(),
            movementDate: invoice.invoiceDate,
            movementType: 'PURCHASE_RECEIPT',
            item: { connect: { id: line.item.id } },
            warehouse: { connect: { id: line.warehouse.id } },
            quantity: Number(line.quantity),
            reference: `Purchase Invoice: ${invoice.invoiceNumber}`,
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
              quantity: Number(stockLevel.quantity) + Number(line.quantity),
              availableQuantity: Number(stockLevel.availableQuantity) + Number(line.quantity),
            },
          });
        } else {
          await this.prisma.stockLevel.create({
            data: {
              itemId: line.item.id,
              warehouseId: line.warehouse.id,
              quantity: Number(line.quantity),
              reservedQuantity: 0,
              availableQuantity: Number(line.quantity),
            },
          });
        }

        // تحديث تكلفة الصنف (متوسط مرجح)
        await this.updateItemCost(line.item.id, Number(line.quantity), Number(line.unitPrice));
      }
    }

    // تحديث حالة الفاتورة
    return this.prisma.purchaseInvoice.update({
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
   * تحديث تكلفة الصنف (متوسط مرجح)
   */
  private async updateItemCost(itemId: string, newQuantity: number, newUnitPrice: number) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: {
        stockLevels: true,
      },
    });

    if (!item) return;

    const totalQuantity = item.stockLevels.reduce((sum, level) => sum + Number(level.quantity), 0);
    const oldCost = Number(item.costPrice) || 0;
    const oldValue = (totalQuantity - newQuantity) * oldCost;
    const newValue = newQuantity * newUnitPrice;
    const totalValue = oldValue + newValue;
    const averageCost = totalQuantity > 0 ? totalValue / totalQuantity : newUnitPrice;

    await this.prisma.item.update({
      where: { id: itemId },
      data: { costPrice: averageCost },
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
      where: { movementNumber: { startsWith: `PR-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let sequence = 1;
    if (lastMovement) {
      const lastNumber = lastMovement.movementNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }
    return `PR-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * إلغاء فاتورة
   */
  async cancel(id: string, userId?: string) {
    const invoice = await this.prisma.purchaseInvoice.findUnique({
      where: { id },
      include: { payments: true },
    });
    if (!invoice) throw new NotFoundException('Purchase invoice not found');
    if (invoice.status === 'CANCELLED') throw new BadRequestException('Invoice is already cancelled');
    if (invoice.status === 'POSTED') throw new BadRequestException('Cannot cancel posted invoice. Use void instead.');
    if (invoice.payments.length > 0) throw new BadRequestException('Cannot cancel invoice with payments');

    return this.prisma.purchaseInvoice.update({
      where: { id },
      data: { status: 'CANCELLED', updatedBy: userId },
    });
  }

  /**
   * عد الفواتير
   */
  async count(where?: Prisma.PurchaseInvoiceWhereInput) {
    return this.prisma.purchaseInvoice.count({ where });
  }

  /**
   * الحصول على الفواتير المستحقة
   */
  async getOverdueInvoices() {
    const today = new Date();
    return this.prisma.purchaseInvoice.findMany({
      where: {
        status: 'POSTED',
        dueDate: { lt: today },
        remainingAmount: { gt: 0 },
      },
      include: {
        supplier: { select: { id: true, code: true, nameEn: true, nameAr: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * الحصول على رصيد مورد
   */
  async getSupplierBalance(supplierId: string) {
    const invoices = await this.prisma.purchaseInvoice.findMany({
      where: {
        supplierId,
        status: 'POSTED',
      },
    });

    const totalInvoices = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + Number(inv.paidAmount), 0);
    const totalRemaining = invoices.reduce((sum, inv) => sum + Number(inv.remainingAmount), 0);

    return {
      supplierId,
      totalInvoices,
      totalPaid,
      totalRemaining,
      invoiceCount: invoices.length,
    };
  }
}
