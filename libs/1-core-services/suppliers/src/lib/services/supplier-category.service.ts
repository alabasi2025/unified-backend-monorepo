/**
 * SEMOP - Supplier Category Service
 * خدمة إدارة فئات الموردين
 * 
 * @module SupplierCategoryService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SupplierCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء فئة موردين جديدة
   */
  async create(data: Prisma.SupplierCategoryCreateInput, userId?: string) {
    // التحقق من عدم تكرار الكود
    const existing = await this.prisma.supplierCategory.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new ConflictException(`Supplier category with code ${data.code} already exists`);
    }

    return this.prisma.supplierCategory.create({
      data: {
        ...data,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  /**
   * الحصول على جميع فئات الموردين
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.SupplierCategoryWhereInput;
    orderBy?: Prisma.SupplierCategoryOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [categories, total] = await Promise.all([
      this.prisma.supplierCategory.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          _count: {
            select: { suppliers: true },
          },
        },
      }),
      this.prisma.supplierCategory.count({ where }),
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
    const category = await this.prisma.supplierCategory.findUnique({
      where: { id },
      include: {
        suppliers: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { suppliers: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Supplier category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * الحصول على فئة بالكود
   */
  async findByCode(code: string) {
    const category = await this.prisma.supplierCategory.findUnique({
      where: { code },
      include: {
        _count: {
          select: { suppliers: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Supplier category with code ${code} not found`);
    }

    return category;
  }

  /**
   * تحديث فئة
   */
  async update(id: string, data: Prisma.SupplierCategoryUpdateInput, userId?: string) {
    const existing = await this.prisma.supplierCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Supplier category with ID ${id} not found`);
    }

    // التحقق من عدم تكرار الكود
    if (data.code && data.code !== existing.code) {
      const existingByCode = await this.prisma.supplierCategory.findUnique({
        where: { code: data.code as string },
      });
      if (existingByCode) {
        throw new ConflictException(`Supplier category with code ${data.code} already exists`);
      }
    }

    return this.prisma.supplierCategory.update({
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
    const existing = await this.prisma.supplierCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { suppliers: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Supplier category with ID ${id} not found`);
    }

    if (existing._count.suppliers > 0) {
      throw new BadRequestException('Cannot delete category with existing suppliers. Deactivate instead.');
    }

    return this.prisma.supplierCategory.update({
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
    const existing = await this.prisma.supplierCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Supplier category with ID ${id} not found`);
    }

    return this.prisma.supplierCategory.update({
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
  async count(where?: Prisma.SupplierCategoryWhereInput) {
    return this.prisma.supplierCategory.count({ where });
  }
}
