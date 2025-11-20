/**
 * SEMOP - Customer Category Service
 * خدمة إدارة فئات العملاء
 * 
 * @module CustomerCategoryService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء فئة عملاء جديدة
   */
  async create(data: Prisma.CustomerCategoryCreateInput, userId?: string) {
    // التحقق من عدم تكرار الكود
    const existing = await this.prisma.customerCategory.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new ConflictException(`Customer category with code ${data.code} already exists`);
    }

    // التحقق من نسبة الخصم
    if (data.discountPercentage && (Number(data.discountPercentage) < 0 || Number(data.discountPercentage) > 100)) {
      throw new BadRequestException('Discount percentage must be between 0 and 100');
    }

    return this.prisma.customerCategory.create({
      data: {
        ...data,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  /**
   * الحصول على جميع فئات العملاء
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CustomerCategoryWhereInput;
    orderBy?: Prisma.CustomerCategoryOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [categories, total] = await Promise.all([
      this.prisma.customerCategory.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          _count: {
            select: { customers: true },
          },
        },
      }),
      this.prisma.customerCategory.count({ where }),
    ]);

    return {
      data: categories,
      total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  /**
   * الحصول على فئة بالمعرف
   */
  async findOne(id: string) {
    const category = await this.prisma.customerCategory.findUnique({
      where: { id },
      include: {
        customers: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { customers: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Customer category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * الحصول على فئة بالكود
   */
  async findByCode(code: string) {
    const category = await this.prisma.customerCategory.findUnique({
      where: { code },
      include: {
        _count: {
          select: { customers: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Customer category with code ${code} not found`);
    }

    return category;
  }

  /**
   * تحديث فئة
   */
  async update(id: string, data: Prisma.CustomerCategoryUpdateInput, userId?: string) {
    const existing = await this.prisma.customerCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Customer category with ID ${id} not found`);
    }

    // التحقق من عدم تكرار الكود
    if (data.code && data.code !== existing.code) {
      const existingByCode = await this.prisma.customerCategory.findUnique({
        where: { code: data.code as string },
      });
      if (existingByCode) {
        throw new ConflictException(`Customer category with code ${data.code} already exists`);
      }
    }

    // التحقق من نسبة الخصم
    if (data.discountPercentage && (Number(data.discountPercentage) < 0 || Number(data.discountPercentage) > 100)) {
      throw new BadRequestException('Discount percentage must be between 0 and 100');
    }

    return this.prisma.customerCategory.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
    });
  }

  /**
   * حذف فئة (Soft Delete)
   */
  async remove(id: string, userId?: string) {
    const existing = await this.prisma.customerCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { customers: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Customer category with ID ${id} not found`);
    }

    if (existing._count.customers > 0) {
      throw new BadRequestException('Cannot delete category with existing customers. Deactivate instead.');
    }

    return this.prisma.customerCategory.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: userId,
      },
    });
  }

  /**
   * تفعيل فئة
   */
  async activate(id: string, userId?: string) {
    const existing = await this.prisma.customerCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Customer category with ID ${id} not found`);
    }

    return this.prisma.customerCategory.update({
      where: { id },
      data: {
        isActive: true,
        updatedBy: userId,
      },
    });
  }

  /**
   * عد الفئات
   */
  async count(where?: Prisma.CustomerCategoryWhereInput) {
    return this.prisma.customerCategory.count({ where });
  }
}
