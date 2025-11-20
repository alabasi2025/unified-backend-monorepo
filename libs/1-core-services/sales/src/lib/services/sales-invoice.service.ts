/**
 * SEMOP - Sales Invoice Service
 * خدمة إدارة فواتير البيع
 * 
 * @module SalesInvoiceService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma, SalesInvoiceStatus } from '@prisma/client';

@Injectable()
export class SalesInvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء فاتورة بيع جديدة
   */
  async create(data: {
    customerId: string;
    invoiceDate: Date;
    dueDate?: Date;
    salesOrderId?: string;
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
    // التحقق من العميل
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
      include: { receivableAccount: true },
    });
    if (!customer || !customer.isActive) {
      throw new NotFoundException('Customer not found or not active');
    }
    if (!customer.receivableAccount) {
      throw new BadRequestException('Customer does not have a receivable account');
    }

    // التحقق من طلب البيع إن وجد
    if (data.salesOrderId) {
      const salesOrder = await this.prisma.salesOrder.findUnique({
        where: { id: data.salesOrderId },
      });
      if (!salesOrder) throw new NotFoundException('Sales order not found');
      if (salesOrder.status !== 'APPROVED') {
        throw new BadRequestException('Sales order must be approved');
      }
    }

    // التحقق من السطور
    if (!data.lines || data.lines.length === 0) {
      throw new BadRequestException('Invoice must have at least one line');
    }

    // التحقق من الأصناف والمخازن والمخزون
    for (const line of data.lines) {
      const item = await this.prisma.item.findUnique({
        where: { id: line.itemId },
        include: { salesAccount: true, inventoryAccount: true },
      });
      if (!item || !item.isActive) {
        throw new NotFoundException(`Item ${line.itemId} not found or not active`);
      }
      if (!item.salesAccount) {
        throw new BadRequestException(`Item ${item.code} does not have a sales account`);
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
      
      // التحقق من سعر البيع الأدنى
      if (item.minSellingPrice && line.unitPrice < Number(item.minSellingPrice)) {
        throw new BadRequestException(`Unit price for item ${item.code} is below minimum selling price`);
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

    return this.prisma.salesInvoice.create({
      data: {
        invoiceNumber,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        status: 'DRAFT',
        customer: { connect: { id: data.customerId } },
        salesOrder: data.salesOrderId ? { connect: { id: data.salesOrderId } } : undefined,
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
        customer: true,
        salesOrder: true,
        lines: { include: { item: true, warehouse: true } },
      },
    });
  }

  /**
   * توليد رقم فاتورة تلقائي
   */
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastInvoice = await this.prisma.salesInvoice.findFirst({
      where: { invoiceNumber: { startsWith: `SI-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let sequence = 1;
    if (lastInvoice) {
      const lastNumber = lastInvoice.invoiceNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }
    return `SI-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * الحصول على جميع الفواتير
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SalesInvoiceWhereInput;
    orderBy?: Prisma.SalesInvoiceOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [invoices, total] = await Promise.all([
      this.prisma.salesInvoice.findMany({
        skip, take, where,
        orderBy: orderBy || { invoiceDate: 'desc' },
        include: {
          customer: { select: { id: true, code: true, nameEn: true, nameAr: true } },
          salesOrder: { select: { id: true, orderNumber: true } },
          _count: { select: { lines: true, payments: true } },
        },
      }),
      this.prisma.salesInvoice.count({ where }),
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
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { id },
      include: {
        customer: true,
        salesOrder: true,
        journalEntry: true,
        lines: { include: { item: true, warehouse: true }, orderBy: { lineNumber: 'asc' } },
        payments: { orderBy: { paymentDate: 'desc' } },
      },
    });
    if (!invoice) throw new NotFoundException(`Sales invoice with ID ${id} not found`);
    return invoice;
  }

  /**
   * الحصول على فاتورة برقم الفاتورة
   */
  async findByNumber(invoiceNumber: string) {
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { invoiceNumber },
      include: {
        customer: true,
        lines: { include: { item: true, warehouse: true } },
      },
    });
    if (!invoice) throw new NotFoundException(`Sales invoice with number ${invoiceNumber} not found`);
    return invoice;
  }

  /**
   * ترحيل الفاتورة (إنشاء قيد محاسبي وتحديث المخزون)
   */
  async post(id: string, userId?: string) {
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { id },
      include: {
        customer: { include: { receivableAccount: true } },
        lines: { include: { item: { include: { salesAccount: true, inventoryAccount: true } }, warehouse: true } },
      },
    });

    if (!invoice) throw new NotFoundException('Sales invoice not found');
    if (invoice.status !== 'DRAFT') throw new BadRequestException('Can only post draft invoices');
    if (invoice.lines.length === 0) throw new BadRequestException('Cannot post invoice with no lines');

    // إنشاء قيد محاسبي
    const journalEntryNumber = await this.generateJournalEntryNumber();
    const journalEntryLines: any[] = [];

    // سطور الإيرادات (دائن)
    const itemAccountsMap = new Map<string, number>();
    for (const line of invoice.lines) {
      const accountId = line.item.salesAccount!.id;
      const currentAmount = itemAccountsMap.get(accountId) || 0;
      itemAccountsMap.set(accountId, currentAmount + Number(line.netAmount));
    }

    itemAccountsMap.forEach((amount, accountId) => {
      journalEntryLines.push({
        accountId,
        debit: 0,
        credit: amount,
        description: `Sales Invoice: ${invoice.invoiceNumber}`,
      });
    });

    // سطر المدينين (مدين)
    journalEntryLines.push({
      accountId: invoice.customer.receivableAccount!.id,
      debit: Number(invoice.totalAmount),
      credit: 0,
      description: `Sales Invoice: ${invoice.invoiceNumber} - ${invoice.customer.nameEn}`,
    });

    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        entryNumber: journalEntryNumber,
        entryDate: invoice.invoiceDate,
        entryType: 'SALES',
        description: `Sales Invoice: ${invoice.invoiceNumber}`,
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
            movementType: 'SALES_ISSUE',
            item: { connect: { id: line.item.id } },
            warehouse: { connect: { id: line.warehouse.id } },
            quantity: Number(line.quantity),
            reference: `Sales Invoice: ${invoice.invoiceNumber}`,
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

    // تحديث حالة الفاتورة
    return this.prisma.salesInvoice.update({
      where: { id },
      data: {
        status: 'POSTED',
        postedAt: new Date(),
        postedBy: userId,
        journalEntry: { connect: { id: journalEntry.id } },
        updatedBy: userId,
      },
      include: {
        customer: true,
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
      where: { movementNumber: { startsWith: `SI-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let sequence = 1;
    if (lastMovement) {
      const lastNumber = lastMovement.movementNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }
    return `SI-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * تحديث فاتورة
   */
  async update(id: string, data: { dueDate?: Date; notes?: string }, userId?: string) {
    const existing = await this.prisma.salesInvoice.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Sales invoice with ID ${id} not found`);
    if (existing.status !== 'DRAFT') throw new BadRequestException('Can only update draft invoices');

    return this.prisma.salesInvoice.update({
      where: { id },
      data: { ...data, updatedBy: userId },
      include: {
        customer: true,
        lines: { include: { item: true, warehouse: true } },
      },
    });
  }

  /**
   * إلغاء فاتورة
   */
  async cancel(id: string, userId?: string) {
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { id },
      include: { payments: true },
    });
    if (!invoice) throw new NotFoundException('Sales invoice not found');
    if (invoice.status === 'CANCELLED') throw new BadRequestException('Invoice is already cancelled');
    if (invoice.status === 'POSTED') throw new BadRequestException('Cannot cancel posted invoice');
    if (invoice.payments.length > 0) throw new BadRequestException('Cannot cancel invoice with payments');

    return this.prisma.salesInvoice.update({
      where: { id },
      data: { status: 'CANCELLED', updatedBy: userId },
    });
  }

  /**
   * عد الفواتير
   */
  async count(where?: Prisma.SalesInvoiceWhereInput) {
    return this.prisma.salesInvoice.count({ where });
  }

  /**
   * الحصول على الفواتير المستحقة
   */
  async getOverdueInvoices() {
    const today = new Date();
    return this.prisma.salesInvoice.findMany({
      where: {
        status: 'POSTED',
        dueDate: { lt: today },
        remainingAmount: { gt: 0 },
      },
      include: {
        customer: { select: { id: true, code: true, nameEn: true, nameAr: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * الحصول على رصيد عميل
   */
  async getCustomerBalance(customerId: string) {
    const invoices = await this.prisma.salesInvoice.findMany({
      where: {
        customerId,
        status: 'POSTED',
      },
    });

    const totalInvoices = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + Number(inv.paidAmount), 0);
    const totalRemaining = invoices.reduce((sum, inv) => sum + Number(inv.remainingAmount), 0);

    return {
      customerId,
      totalInvoices,
      totalPaid,
      totalRemaining,
      invoiceCount: invoices.length,
    };
  }

  /**
   * الحصول على فواتير عميل
   */
  async getCustomerInvoices(customerId: string) {
    return this.prisma.salesInvoice.findMany({
      where: { customerId },
      include: {
        lines: { include: { item: true } },
      },
      orderBy: { invoiceDate: 'desc' },
    });
  }

  /**
   * الحصول على إحصائيات الفواتير
   */
  async getStatistics(startDate?: Date, endDate?: Date) {
    const where: Prisma.SalesInvoiceWhereInput = {
      status: 'POSTED',
    };

    if (startDate || endDate) {
      where.invoiceDate = {};
      if (startDate) where.invoiceDate.gte = startDate;
      if (endDate) where.invoiceDate.lte = endDate;
    }

    const invoices = await this.prisma.salesInvoice.findMany({
      where,
      include: { lines: true },
    });

    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + Number(inv.paidAmount), 0);
    const totalRemaining = invoices.reduce((sum, inv) => sum + Number(inv.remainingAmount), 0);
    const totalItems = invoices.reduce((sum, inv) => sum + inv.lines.length, 0);

    return {
      totalInvoices,
      totalAmount,
      totalPaid,
      totalRemaining,
      totalItems,
      averageInvoiceValue: totalInvoices > 0 ? totalAmount / totalInvoices : 0,
      collectionRate: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0,
    };
  }
}
