/**
 * SEMOP - Customer Service
 * خدمة إدارة العملاء
 * 
 * @module CustomerService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء عميل جديد
   */
  async create(data: Prisma.CustomerCreateInput, userId?: string) {
    // التحقق من عدم تكرار الكود
    const existingByCode = await this.prisma.customer.findUnique({
      where: { code: data.code },
    });
    if (existingByCode) {
      throw new ConflictException(`Customer with code ${data.code} already exists`);
    }

    // التحقق من عدم تكرار الرقم الضريبي
    if (data.taxNumber) {
      const existingByTax = await this.prisma.customer.findUnique({
        where: { taxNumber: data.taxNumber },
      });
      if (existingByTax) {
        throw new ConflictException(`Customer with tax number ${data.taxNumber} already exists`);
      }
    }

    // التحقق من وجود الفئة
    if (data.category?.connect?.id) {
      const category = await this.prisma.customerCategory.findUnique({
        where: { id: data.category.connect.id },
      });
      if (!category) {
        throw new NotFoundException('Customer category not found');
      }
      if (!category.isActive) {
        throw new BadRequestException('Customer category is not active');
      }
    }

    return this.prisma.customer.create({
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
   * الحصول على جميع العملاء مع فلاتر
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithRelationInput;
    include?: Prisma.CustomerInclude;
  }) {
    const { skip, take, where, orderBy, include } = params;

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
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
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على عميل بالمعرف
   */
  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        category: true,
        addresses: true,
        contacts: true,
        salesOrders: {
          take: 10,
          orderBy: { orderDate: 'desc' },
        },
        salesInvoices: {
          take: 10,
          orderBy: { invoiceDate: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  /**
   * الحصول على عميل بالكود
   */
  async findByCode(code: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { code },
      include: {
        category: true,
        addresses: true,
        contacts: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with code ${code} not found`);
    }

    return customer;
  }

  /**
   * الحصول على عميل بالرقم الضريبي
   */
  async findByTaxNumber(taxNumber: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { taxNumber },
      include: {
        category: true,
        addresses: true,
        contacts: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with tax number ${taxNumber} not found`);
    }

    return customer;
  }

  /**
   * تحديث عميل
   */
  async update(id: string, data: Prisma.CustomerUpdateInput, userId?: string) {
    // التحقق من وجود العميل
    const existing = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // التحقق من عدم تكرار الكود
    if (data.code && data.code !== existing.code) {
      const existingByCode = await this.prisma.customer.findUnique({
        where: { code: data.code as string },
      });
      if (existingByCode) {
        throw new ConflictException(`Customer with code ${data.code} already exists`);
      }
    }

    // التحقق من عدم تكرار الرقم الضريبي
    if (data.taxNumber && data.taxNumber !== existing.taxNumber) {
      const existingByTax = await this.prisma.customer.findUnique({
        where: { taxNumber: data.taxNumber as string },
      });
      if (existingByTax) {
        throw new ConflictException(`Customer with tax number ${data.taxNumber} already exists`);
      }
    }

    return this.prisma.customer.update({
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
   * حذف عميل (Soft Delete)
   */
  async remove(id: string, userId?: string) {
    // التحقق من وجود العميل
    const existing = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        salesOrders: true,
        salesInvoices: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // التحقق من عدم وجود طلبات مبيعات أو فواتير
    if (existing.salesOrders.length > 0 || existing.salesInvoices.length > 0) {
      throw new BadRequestException('Cannot delete customer with existing sales orders or invoices. Deactivate instead.');
    }

    return this.prisma.customer.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: userId,
      },
    });
  }

  /**
   * تفعيل عميل
   */
  async activate(id: string, userId?: string) {
    const existing = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return this.prisma.customer.update({
      where: { id },
      data: {
        isActive: true,
        updatedBy: userId,
      },
    });
  }

  /**
   * عد العملاء
   */
  async count(where?: Prisma.CustomerWhereInput) {
    return this.prisma.customer.count({ where });
  }

  /**
   * تحديث الرصيد الحالي للعميل
   */
  async updateBalance(id: string, amount: number, userId?: string) {
    const existing = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const newBalance = Number(existing.currentBalance) + amount;

    return this.prisma.customer.update({
      where: { id },
      data: {
        currentBalance: newBalance,
        updatedBy: userId,
      },
    });
  }

  /**
   * الحصول على الرصيد الحالي للعميل
   */
  async getBalance(id: string) {
    const customer = await this.prisma.customer.findUnique({
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

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return {
      ...customer,
      availableCredit: Number(customer.creditLimit) - Number(customer.currentBalance),
    };
  }

  /**
   * إضافة عنوان للعميل
   */
  async addAddress(customerId: string, data: Prisma.CustomerAddressCreateInput) {
    // التحقق من وجود العميل
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // إذا كان العنوان رئيسي، إلغاء العناوين الرئيسية الأخرى
    if (data.isPrimary) {
      await this.prisma.customerAddress.updateMany({
        where: { customerId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.customerAddress.create({
      data,
    });
  }

  /**
   * تحديث عنوان العميل
   */
  async updateAddress(addressId: string, data: Prisma.CustomerAddressUpdateInput) {
    const existing = await this.prisma.customerAddress.findUnique({
      where: { id: addressId },
    });

    if (!existing) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    // إذا كان العنوان رئيسي، إلغاء العناوين الرئيسية الأخرى
    if (data.isPrimary === true) {
      await this.prisma.customerAddress.updateMany({
        where: { 
          customerId: existing.customerId,
          id: { not: addressId },
        },
        data: { isPrimary: false },
      });
    }

    return this.prisma.customerAddress.update({
      where: { id: addressId },
      data,
    });
  }

  /**
   * حذف عنوان العميل
   */
  async removeAddress(addressId: string) {
    const existing = await this.prisma.customerAddress.findUnique({
      where: { id: addressId },
    });

    if (!existing) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    return this.prisma.customerAddress.delete({
      where: { id: addressId },
    });
  }

  /**
   * إضافة جهة اتصال للعميل
   */
  async addContact(customerId: string, data: Prisma.CustomerContactCreateInput) {
    // التحقق من وجود العميل
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // إذا كانت جهة الاتصال رئيسية، إلغاء جهات الاتصال الرئيسية الأخرى
    if (data.isPrimary) {
      await this.prisma.customerContact.updateMany({
        where: { customerId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.customerContact.create({
      data,
    });
  }

  /**
   * تحديث جهة اتصال العميل
   */
  async updateContact(contactId: string, data: Prisma.CustomerContactUpdateInput) {
    const existing = await this.prisma.customerContact.findUnique({
      where: { id: contactId },
    });

    if (!existing) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }

    // إذا كانت جهة الاتصال رئيسية، إلغاء جهات الاتصال الرئيسية الأخرى
    if (data.isPrimary === true) {
      await this.prisma.customerContact.updateMany({
        where: { 
          customerId: existing.customerId,
          id: { not: contactId },
        },
        data: { isPrimary: false },
      });
    }

    return this.prisma.customerContact.update({
      where: { id: contactId },
      data,
    });
  }

  /**
   * حذف جهة اتصال العميل
   */
  async removeContact(contactId: string) {
    const existing = await this.prisma.customerContact.findUnique({
      where: { id: contactId },
    });

    if (!existing) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }

    return this.prisma.customerContact.delete({
      where: { id: contactId },
    });
  }

  /**
   * الحصول على إحصائيات العميل
   */
  async getStatistics(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        salesOrders: {
          where: { status: { not: 'CANCELLED' } },
        },
        salesInvoices: {
          where: { status: { not: 'CANCELLED' } },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const totalOrders = customer.salesOrders.length;
    const totalOrdersAmount = customer.salesOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

    const totalInvoices = customer.salesInvoices.length;
    const totalInvoicesAmount = customer.salesInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount),
      0
    );
    const totalPaid = customer.salesInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.paidAmount),
      0
    );
    const totalRemaining = customer.salesInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.remainingAmount),
      0
    );

    return {
      customerId: customer.id,
      customerCode: customer.code,
      customerName: customer.nameEn,
      currentBalance: Number(customer.currentBalance),
      creditLimit: Number(customer.creditLimit),
      availableCredit: Number(customer.creditLimit) - Number(customer.currentBalance),
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
