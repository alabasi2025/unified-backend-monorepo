/**
 * SEMOP - Supplier Service
 * خدمة إدارة الموردين
 * 
 * @module SupplierService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء مورد جديد
   */
  async create(data: Prisma.SupplierCreateInput, userId?: string) {
    // التحقق من عدم تكرار الكود
    const existingByCode = await this.prisma.supplier.findUnique({
      where: { code: data.code },
    });
    if (existingByCode) {
      throw new ConflictException(`Supplier with code ${data.code} already exists`);
    }

    // التحقق من عدم تكرار الرقم الضريبي
    if (data.taxNumber) {
      const existingByTax = await this.prisma.supplier.findUnique({
        where: { taxNumber: data.taxNumber },
      });
      if (existingByTax) {
        throw new ConflictException(`Supplier with tax number ${data.taxNumber} already exists`);
      }
    }

    // التحقق من وجود الفئة
    if (data.category?.connect?.id) {
      const category = await this.prisma.supplierCategory.findUnique({
        where: { id: data.category.connect.id },
      });
      if (!category) {
        throw new NotFoundException('Supplier category not found');
      }
      if (!category.isActive) {
        throw new BadRequestException('Supplier category is not active');
      }
    }

    return this.prisma.supplier.create({
      data: {
        ...data,
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        category: true,
        addresses: true,
        contacts: true,
      },
    });
  }

  /**
   * الحصول على جميع الموردين مع فلاتر
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithRelationInput;
    include?: Prisma.SupplierInclude;
  }) {
    const { skip, take, where, orderBy, include } = params;

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: include || {
          category: true,
          addresses: true,
          contacts: true,
        },
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return {
      data: suppliers,
      total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على مورد بالمعرف
   */
  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        category: true,
        addresses: true,
        contacts: true,
        purchaseOrders: {
          take: 10,
          orderBy: { orderDate: 'desc' },
        },
        purchaseInvoices: {
          take: 10,
          orderBy: { invoiceDate: 'desc' },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  /**
   * الحصول على مورد بالكود
   */
  async findByCode(code: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { code },
      include: {
        category: true,
        addresses: true,
        contacts: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with code ${code} not found`);
    }

    return supplier;
  }

  /**
   * الحصول على مورد بالرقم الضريبي
   */
  async findByTaxNumber(taxNumber: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { taxNumber },
      include: {
        category: true,
        addresses: true,
        contacts: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with tax number ${taxNumber} not found`);
    }

    return supplier;
  }

  /**
   * تحديث مورد
   */
  async update(id: string, data: Prisma.SupplierUpdateInput, userId?: string) {
    // التحقق من وجود المورد
    const existing = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    // التحقق من عدم تكرار الكود
    if (data.code && data.code !== existing.code) {
      const existingByCode = await this.prisma.supplier.findUnique({
        where: { code: data.code as string },
      });
      if (existingByCode) {
        throw new ConflictException(`Supplier with code ${data.code} already exists`);
      }
    }

    // التحقق من عدم تكرار الرقم الضريبي
    if (data.taxNumber && data.taxNumber !== existing.taxNumber) {
      const existingByTax = await this.prisma.supplier.findUnique({
        where: { taxNumber: data.taxNumber as string },
      });
      if (existingByTax) {
        throw new ConflictException(`Supplier with tax number ${data.taxNumber} already exists`);
      }
    }

    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
      include: {
        category: true,
        addresses: true,
        contacts: true,
      },
    });
  }

  /**
   * حذف مورد (Soft Delete)
   */
  async remove(id: string, userId?: string) {
    // التحقق من وجود المورد
    const existing = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        purchaseOrders: true,
        purchaseInvoices: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    // التحقق من عدم وجود طلبات شراء أو فواتير
    if (existing.purchaseOrders.length > 0 || existing.purchaseInvoices.length > 0) {
      throw new BadRequestException('Cannot delete supplier with existing purchase orders or invoices. Deactivate instead.');
    }

    return this.prisma.supplier.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: userId,
      },
    });
  }

  /**
   * تفعيل مورد
   */
  async activate(id: string, userId?: string) {
    const existing = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return this.prisma.supplier.update({
      where: { id },
      data: {
        isActive: true,
        updatedBy: userId,
      },
    });
  }

  /**
   * عد الموردين
   */
  async count(where?: Prisma.SupplierWhereInput) {
    return this.prisma.supplier.count({ where });
  }

  /**
   * تحديث الرصيد الحالي للمورد
   */
  async updateBalance(id: string, amount: number, userId?: string) {
    const existing = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    const newBalance = Number(existing.currentBalance) + amount;

    return this.prisma.supplier.update({
      where: { id },
      data: {
        currentBalance: newBalance,
        updatedBy: userId,
      },
    });
  }

  /**
   * الحصول على الرصيد الحالي للمورد
   */
  async getBalance(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        nameAr: true,
        nameEn: true,
        currentBalance: true,
        creditLimit: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return {
      ...supplier,
      availableCredit: Number(supplier.creditLimit) - Number(supplier.currentBalance),
    };
  }

  /**
   * إضافة عنوان للمورد
   */
  async addAddress(supplierId: string, data: Prisma.SupplierAddressCreateInput) {
    // التحقق من وجود المورد
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
    }

    // إذا كان العنوان رئيسي، إلغاء العناوين الرئيسية الأخرى
    if (data.isPrimary) {
      await this.prisma.supplierAddress.updateMany({
        where: { supplierId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.supplierAddress.create({
      data,
    });
  }

  /**
   * تحديث عنوان المورد
   */
  async updateAddress(addressId: string, data: Prisma.SupplierAddressUpdateInput) {
    const existing = await this.prisma.supplierAddress.findUnique({
      where: { id: addressId },
    });

    if (!existing) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    // إذا كان العنوان رئيسي، إلغاء العناوين الرئيسية الأخرى
    if (data.isPrimary === true) {
      await this.prisma.supplierAddress.updateMany({
        where: { 
          supplierId: existing.supplierId,
          id: { not: addressId },
        },
        data: { isPrimary: false },
      });
    }

    return this.prisma.supplierAddress.update({
      where: { id: addressId },
      data,
    });
  }

  /**
   * حذف عنوان المورد
   */
  async removeAddress(addressId: string) {
    const existing = await this.prisma.supplierAddress.findUnique({
      where: { id: addressId },
    });

    if (!existing) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    return this.prisma.supplierAddress.delete({
      where: { id: addressId },
    });
  }

  /**
   * إضافة جهة اتصال للمورد
   */
  async addContact(supplierId: string, data: Prisma.SupplierContactCreateInput) {
    // التحقق من وجود المورد
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
    }

    // إذا كانت جهة الاتصال رئيسية، إلغاء جهات الاتصال الرئيسية الأخرى
    if (data.isPrimary) {
      await this.prisma.supplierContact.updateMany({
        where: { supplierId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.supplierContact.create({
      data,
    });
  }

  /**
   * تحديث جهة اتصال المورد
   */
  async updateContact(contactId: string, data: Prisma.SupplierContactUpdateInput) {
    const existing = await this.prisma.supplierContact.findUnique({
      where: { id: contactId },
    });

    if (!existing) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }

    // إذا كانت جهة الاتصال رئيسية، إلغاء جهات الاتصال الرئيسية الأخرى
    if (data.isPrimary === true) {
      await this.prisma.supplierContact.updateMany({
        where: { 
          supplierId: existing.supplierId,
          id: { not: contactId },
        },
        data: { isPrimary: false },
      });
    }

    return this.prisma.supplierContact.update({
      where: { id: contactId },
      data,
    });
  }

  /**
   * حذف جهة اتصال المورد
   */
  async removeContact(contactId: string) {
    const existing = await this.prisma.supplierContact.findUnique({
      where: { id: contactId },
    });

    if (!existing) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }

    return this.prisma.supplierContact.delete({
      where: { id: contactId },
    });
  }

  /**
   * الحصول على إحصائيات المورد
   */
  async getStatistics(supplierId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
      include: {
        purchaseOrders: {
          where: { status: { not: 'CANCELLED' } },
        },
        purchaseInvoices: {
          where: { status: { not: 'CANCELLED' } },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
    }

    const totalOrders = supplier.purchaseOrders.length;
    const totalOrdersAmount = supplier.purchaseOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

    const totalInvoices = supplier.purchaseInvoices.length;
    const totalInvoicesAmount = supplier.purchaseInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount),
      0
    );
    const totalPaid = supplier.purchaseInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.paidAmount),
      0
    );
    const totalRemaining = supplier.purchaseInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.remainingAmount),
      0
    );

    return {
      supplierId: supplier.id,
      supplierCode: supplier.code,
      supplierName: supplier.nameEn,
      currentBalance: Number(supplier.currentBalance),
      creditLimit: Number(supplier.creditLimit),
      availableCredit: Number(supplier.creditLimit) - Number(supplier.currentBalance),
      orders: {
        total: totalOrders,
        totalAmount: totalOrdersAmount,
      },
      invoices: {
        total: totalInvoices,
        totalAmount: totalInvoicesAmount,
        totalPaid,
        totalRemaining,
      },
    };
  }
}
