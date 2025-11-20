/**
 * SEMOP - Sales Order Service
 * خدمة إدارة طلبات البيع
 * 
 * @module SalesOrderService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma, SalesOrderStatus } from '@prisma/client';

@Injectable()
export class SalesOrderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء طلب بيع جديد
   */
  async create(data: {
    customerId: string;
    orderDate: Date;
    expectedDeliveryDate?: Date;
    lines: Array<{
      itemId: string;
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
    });
    if (!customer || !customer.isActive) {
      throw new NotFoundException('Customer not found or not active');
    }

    // التحقق من السطور
    if (!data.lines || data.lines.length === 0) {
      throw new BadRequestException('Sales order must have at least one line');
    }

    // التحقق من الأصناف
    for (const line of data.lines) {
      const item = await this.prisma.item.findUnique({
        where: { id: line.itemId },
      });
      if (!item || !item.isActive) {
        throw new NotFoundException(`Item ${line.itemId} not found or not active`);
      }
      if (!item.isSellable) {
        throw new BadRequestException(`Item ${item.code} is not sellable`);
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

    // توليد رقم الطلب
    const orderNumber = await this.generateOrderNumber();

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
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxRate,
        discountRate,
        lineTotal,
        taxAmount: lineTaxAmount,
        discountAmount: lineDiscountAmount,
        netAmount: lineNetAmount,
        deliveredQuantity: 0,
      };
    });

    const totalAmount = subtotal - discountAmount + taxAmount;

    return this.prisma.salesOrder.create({
      data: {
        orderNumber,
        orderDate: data.orderDate,
        expectedDeliveryDate: data.expectedDeliveryDate,
        status: 'DRAFT',
        customer: { connect: { id: data.customerId } },
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
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
        lines: { include: { item: true } },
      },
    });
  }

  /**
   * توليد رقم طلب بيع تلقائي
   */
  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastOrder = await this.prisma.salesOrder.findFirst({
      where: { orderNumber: { startsWith: `SO-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let sequence = 1;
    if (lastOrder) {
      const lastNumber = lastOrder.orderNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }
    return `SO-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  /**
   * الحصول على جميع طلبات البيع
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SalesOrderWhereInput;
    orderBy?: Prisma.SalesOrderOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [orders, total] = await Promise.all([
      this.prisma.salesOrder.findMany({
        skip, take, where,
        orderBy: orderBy || { orderDate: 'desc' },
        include: {
          customer: { select: { id: true, code: true, nameEn: true, nameAr: true } },
          _count: { select: { lines: true, invoices: true } },
        },
      }),
      this.prisma.salesOrder.count({ where }),
    ]);
    return {
      data: orders, total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على طلب بيع بالمعرف
   */
  async findOne(id: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        lines: { include: { item: true }, orderBy: { lineNumber: 'asc' } },
        invoices: { orderBy: { invoiceDate: 'desc' } },
      },
    });
    if (!order) throw new NotFoundException(`Sales order with ID ${id} not found`);
    return order;
  }

  /**
   * الحصول على طلب بيع برقم الطلب
   */
  async findByNumber(orderNumber: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { orderNumber },
      include: {
        customer: true,
        lines: { include: { item: true } },
      },
    });
    if (!order) throw new NotFoundException(`Sales order with number ${orderNumber} not found`);
    return order;
  }

  /**
   * تحديث طلب بيع
   */
  async update(id: string, data: {
    expectedDeliveryDate?: Date;
    notes?: string;
  }, userId?: string) {
    const existing = await this.prisma.salesOrder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Sales order with ID ${id} not found`);
    if (existing.status !== 'DRAFT' && existing.status !== 'PENDING') {
      throw new BadRequestException('Can only update draft or pending sales orders');
    }

    return this.prisma.salesOrder.update({
      where: { id },
      data: { ...data, updatedBy: userId },
      include: {
        customer: true,
        lines: { include: { item: true } },
      },
    });
  }

  /**
   * إضافة سطر لطلب بيع
   */
  async addLine(orderId: string, data: {
    itemId: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    discountRate?: number;
    description?: string;
  }, userId?: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id: orderId },
      include: { lines: true },
    });
    if (!order) throw new NotFoundException('Sales order not found');
    if (order.status !== 'DRAFT' && order.status !== 'PENDING') {
      throw new BadRequestException('Can only add lines to draft or pending sales orders');
    }

    // التحقق من الصنف
    const item = await this.prisma.item.findUnique({ where: { id: data.itemId } });
    if (!item || !item.isActive || !item.isSellable) {
      throw new BadRequestException('Item not found, not active, or not sellable');
    }

    // حساب السطر
    const lineNumber = order.lines.length + 1;
    const lineTotal = data.quantity * data.unitPrice;
    const taxRate = data.taxRate ?? 15;
    const discountRate = data.discountRate ?? 0;
    const lineDiscountAmount = lineTotal * (discountRate / 100);
    const lineTaxAmount = (lineTotal - lineDiscountAmount) * (taxRate / 100);
    const lineNetAmount = lineTotal - lineDiscountAmount + lineTaxAmount;

    const line = await this.prisma.salesOrderLine.create({
      data: {
        salesOrder: { connect: { id: orderId } },
        lineNumber,
        item: { connect: { id: data.itemId } },
        description: data.description,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        taxRate,
        discountRate,
        lineTotal,
        taxAmount: lineTaxAmount,
        discountAmount: lineDiscountAmount,
        netAmount: lineNetAmount,
        deliveredQuantity: 0,
      },
      include: { item: true },
    });

    // تحديث مجاميع الطلب
    await this.recalculateTotals(orderId, userId);
    return line;
  }

  /**
   * تحديث سطر طلب بيع
   */
  async updateLine(lineId: string, data: {
    quantity?: number;
    unitPrice?: number;
    taxRate?: number;
    discountRate?: number;
    description?: string;
  }, userId?: string) {
    const line = await this.prisma.salesOrderLine.findUnique({
      where: { id: lineId },
      include: { salesOrder: true },
    });
    if (!line) throw new NotFoundException('Sales order line not found');
    if (line.salesOrder.status !== 'DRAFT' && line.salesOrder.status !== 'PENDING') {
      throw new BadRequestException('Can only update lines in draft or pending sales orders');
    }

    const quantity = data.quantity ?? Number(line.quantity);
    const unitPrice = data.unitPrice ?? Number(line.unitPrice);
    const taxRate = data.taxRate ?? Number(line.taxRate);
    const discountRate = data.discountRate ?? Number(line.discountRate);

    const lineTotal = quantity * unitPrice;
    const lineDiscountAmount = lineTotal * (discountRate / 100);
    const lineTaxAmount = (lineTotal - lineDiscountAmount) * (taxRate / 100);
    const lineNetAmount = lineTotal - lineDiscountAmount + lineTaxAmount;

    const updatedLine = await this.prisma.salesOrderLine.update({
      where: { id: lineId },
      data: {
        quantity, unitPrice, taxRate, discountRate,
        description: data.description,
        lineTotal, taxAmount: lineTaxAmount,
        discountAmount: lineDiscountAmount,
        netAmount: lineNetAmount,
      },
      include: { item: true },
    });

    await this.recalculateTotals(line.salesOrder.id, userId);
    return updatedLine;
  }

  /**
   * حذف سطر من طلب بيع
   */
  async removeLine(lineId: string, userId?: string) {
    const line = await this.prisma.salesOrderLine.findUnique({
      where: { id: lineId },
      include: { salesOrder: true },
    });
    if (!line) throw new NotFoundException('Sales order line not found');
    if (line.salesOrder.status !== 'DRAFT' && line.salesOrder.status !== 'PENDING') {
      throw new BadRequestException('Can only delete lines from draft or pending sales orders');
    }

    await this.prisma.salesOrderLine.delete({ where: { id: lineId } });
    await this.recalculateTotals(line.salesOrder.id, userId);
    return { success: true };
  }

  /**
   * إعادة حساب مجاميع الطلب
   */
  private async recalculateTotals(orderId: string, userId?: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id: orderId },
      include: { lines: true },
    });
    if (!order) return;

    const subtotal = order.lines.reduce((sum, line) => sum + Number(line.lineTotal), 0);
    const taxAmount = order.lines.reduce((sum, line) => sum + Number(line.taxAmount), 0);
    const discountAmount = order.lines.reduce((sum, line) => sum + Number(line.discountAmount), 0);
    const totalAmount = subtotal - discountAmount + taxAmount;

    await this.prisma.salesOrder.update({
      where: { id: orderId },
      data: { subtotal, taxAmount, discountAmount, totalAmount, updatedBy: userId },
    });
  }

  /**
   * اعتماد طلب بيع
   */
  async approve(id: string, userId?: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: { lines: true },
    });
    if (!order) throw new NotFoundException('Sales order not found');
    if (order.status !== 'PENDING') throw new BadRequestException('Can only approve pending sales orders');
    if (order.lines.length === 0) throw new BadRequestException('Cannot approve sales order with no lines');

    return this.prisma.salesOrder.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: userId,
        updatedBy: userId,
      },
      include: {
        customer: true,
        lines: { include: { item: true } },
      },
    });
  }

  /**
   * إرسال طلب بيع
   */
  async submit(id: string, userId?: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: { lines: true },
    });
    if (!order) throw new NotFoundException('Sales order not found');
    if (order.status !== 'DRAFT') throw new BadRequestException('Can only submit draft sales orders');
    if (order.lines.length === 0) throw new BadRequestException('Cannot submit sales order with no lines');

    return this.prisma.salesOrder.update({
      where: { id },
      data: { status: 'PENDING', updatedBy: userId },
      include: {
        customer: true,
        lines: { include: { item: true } },
      },
    });
  }

  /**
   * إلغاء طلب بيع
   */
  async cancel(id: string, userId?: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: { invoices: true },
    });
    if (!order) throw new NotFoundException('Sales order not found');
    if (order.status === 'DELIVERED') throw new BadRequestException('Cannot cancel fully delivered sales order');
    if (order.status === 'CANCELLED') throw new BadRequestException('Sales order is already cancelled');
    if (order.invoices.length > 0) throw new BadRequestException('Cannot cancel sales order with existing invoices');

    return this.prisma.salesOrder.update({
      where: { id },
      data: { status: 'CANCELLED', updatedBy: userId },
    });
  }

  /**
   * عد طلبات البيع
   */
  async count(where?: Prisma.SalesOrderWhereInput) {
    return this.prisma.salesOrder.count({ where });
  }

  /**
   * الحصول على طلبات عميل
   */
  async getCustomerOrders(customerId: string) {
    return this.prisma.salesOrder.findMany({
      where: { customerId },
      include: {
        lines: { include: { item: true } },
      },
      orderBy: { orderDate: 'desc' },
    });
  }

  /**
   * الحصول على إحصائيات الطلبات
   */
  async getStatistics(startDate?: Date, endDate?: Date) {
    const where: Prisma.SalesOrderWhereInput = {};
    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) where.orderDate.gte = startDate;
      if (endDate) where.orderDate.lte = endDate;
    }

    const orders = await this.prisma.salesOrder.findMany({
      where,
      include: { lines: true },
    });

    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, ord) => sum + Number(ord.totalAmount), 0);
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const approvedOrders = orders.filter(o => o.status === 'APPROVED').length;
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;

    return {
      totalOrders,
      totalAmount,
      pendingOrders,
      approvedOrders,
      deliveredOrders,
      averageOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0,
    };
  }
}
