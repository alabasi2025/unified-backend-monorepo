/**
 * SEMOP - Purchase Order Service
 * خدمة إدارة طلبات الشراء
 * 
 * @module PurchaseOrderService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PurchaseOrderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء طلب شراء جديد
   */
  async create(data: {
    supplierId: string;
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
    // التحقق من وجود المورد
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: data.supplierId },
    });
    if (!supplier || !supplier.isActive) {
      throw new NotFoundException('Supplier not found or not active');
    }

    // التحقق من السطور
    if (!data.lines || data.lines.length === 0) {
      throw new BadRequestException('Purchase order must have at least one line');
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
        receivedQuantity: 0,
      };
    });

    const totalAmount = subtotal - discountAmount + taxAmount;

    return this.prisma.purchaseOrder.create({
      data: {
        orderNumber,
        orderDate: data.orderDate,
        expectedDeliveryDate: data.expectedDeliveryDate,
        status: 'DRAFT',
        supplier: { connect: { id: data.supplierId } },
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
        supplier: true,
        lines: { include: { item: true } },
      },
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastOrder = await this.prisma.purchaseOrder.findFirst({
      where: { orderNumber: { startsWith: `PO-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let sequence = 1;
    if (lastOrder) {
      const lastNumber = lastOrder.orderNumber.split('-').pop();
      sequence = parseInt(lastNumber || '0') + 1;
    }
    return `PO-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  async findAll(params: any) {
    const { skip, take, where, orderBy } = params;
    const [orders, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        skip, take, where,
        orderBy: orderBy || { orderDate: 'desc' },
        include: {
          supplier: { select: { id: true, code: true, nameEn: true, nameAr: true } },
          _count: { select: { lines: true, invoices: true } },
        },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);
    return {
      data: orders, total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        lines: { include: { item: true }, orderBy: { lineNumber: 'asc' } },
        invoices: { orderBy: { invoiceDate: 'desc' } },
      },
    });
    if (!order) throw new NotFoundException(`Purchase order with ID ${id} not found`);
    return order;
  }

  async findByNumber(orderNumber: string) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { orderNumber },
      include: { supplier: true, lines: { include: { item: true } } },
    });
    if (!order) throw new NotFoundException(`Purchase order with number ${orderNumber} not found`);
    return order;
  }

  async update(id: string, data: any, userId?: string) {
    const existing = await this.prisma.purchaseOrder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Purchase order with ID ${id} not found`);
    if (existing.status !== 'DRAFT' && existing.status !== 'PENDING') {
      throw new BadRequestException('Can only update draft or pending purchase orders');
    }
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { ...data, updatedBy: userId },
      include: { supplier: true, lines: { include: { item: true } } },
    });
  }

  async approve(id: string, userId?: string) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { lines: true },
    });
    if (!order) throw new NotFoundException('Purchase order not found');
    if (order.status !== 'PENDING') throw new BadRequestException('Can only approve pending purchase orders');
    if (order.lines.length === 0) throw new BadRequestException('Cannot approve purchase order with no lines');
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'APPROVED', approvedAt: new Date(), approvedBy: userId, updatedBy: userId },
      include: { supplier: true, lines: { include: { item: true } } },
    });
  }

  async submit(id: string, userId?: string) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { lines: true },
    });
    if (!order) throw new NotFoundException('Purchase order not found');
    if (order.status !== 'DRAFT') throw new BadRequestException('Can only submit draft purchase orders');
    if (order.lines.length === 0) throw new BadRequestException('Cannot submit purchase order with no lines');
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'PENDING', updatedBy: userId },
      include: { supplier: true, lines: { include: { item: true } } },
    });
  }

  async cancel(id: string, userId?: string) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { invoices: true },
    });
    if (!order) throw new NotFoundException('Purchase order not found');
    if (order.status === 'RECEIVED') throw new BadRequestException('Cannot cancel fully received purchase order');
    if (order.status === 'CANCELLED') throw new BadRequestException('Purchase order is already cancelled');
    if (order.invoices.length > 0) throw new BadRequestException('Cannot cancel purchase order with existing invoices');
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'CANCELLED', updatedBy: userId },
    });
  }

  async count(where?: any) {
    return this.prisma.purchaseOrder.count({ where });
  }
}
