/**
 * SEMOP - Item Category Service
 * خدمة إدارة فئات الأصناف
 * 
 * @module ItemCategoryService
 * @version 0.4.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../multi-entity/src/lib/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء فئة أصناف جديدة
   */
  async create(data: Prisma.ItemCategoryCreateInput, userId?: string) {
    // التحقق من عدم تكرار الكود
    const existing = await this.prisma.itemCategory.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new ConflictException(`Item category with code ${data.code} already exists`);
    }

    // التحقق من وجود الفئة الأب
    if (data.parent?.connect?.id) {
      const parent = await this.prisma.itemCategory.findUnique({
        where: { id: data.parent.connect.id },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      if (!parent.isActive) {
        throw new BadRequestException('Parent category is not active');
      }
    }

    return this.prisma.itemCategory.create({
      data: {
        ...data,
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        parent: true,
      },
    });
  }

  /**
   * الحصول على جميع فئات الأصناف
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ItemCategoryWhereInput;
    orderBy?: Prisma.ItemCategoryOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [categories, total] = await Promise.all([
      this.prisma.itemCategory.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          parent: true,
          _count: {
            select: {
              items: true,
              children: true,
            },
          },
        },
      }),
      this.prisma.itemCategory.count({ where }),
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
    const category = await this.prisma.itemCategory.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        items: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            items: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Item category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * الحصول على فئة بالكود
   */
  async findByCode(code: string) {
    const category = await this.prisma.itemCategory.findUnique({
      where: { code },
      include: {
        parent: true,
        _count: {
          select: {
            items: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Item category with code ${code} not found`);
    }

    return category;
  }

  /**
   * الحصول على الفئات الرئيسية (بدون أب)
   */
  async findRootCategories() {
    return this.prisma.itemCategory.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            items: true,
            children: true,
          },
        },
      },
      orderBy: {
        nameEn: 'asc',
      },
    });
  }

  /**
   * الحصول على الفئات الفرعية لفئة معينة
   */
  async findChildren(parentId: string) {
    const parent = await this.prisma.itemCategory.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      throw new NotFoundException(`Parent category with ID ${parentId} not found`);
    }

    return this.prisma.itemCategory.findMany({
      where: {
        parentId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            items: true,
            children: true,
          },
        },
      },
      orderBy: {
        nameEn: 'asc',
      },
    });
  }

  /**
   * الحصول على شجرة الفئات الكاملة
   */
  async getTree() {
    const categories = await this.prisma.itemCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            items: true,
            children: true,
          },
        },
      },
      orderBy: {
        nameEn: 'asc',
      },
    });

    // بناء الشجرة
    const buildTree = (parentId: string | null): any[] => {
      return categories
        .filter(cat => cat.parentId === parentId)
        .map(cat => ({
          ...cat,
          children: buildTree(cat.id),
        }));
    };

    return buildTree(null);
  }

  /**
   * تحديث فئة
   */
  async update(id: string, data: Prisma.ItemCategoryUpdateInput, userId?: string) {
    const existing = await this.prisma.itemCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Item category with ID ${id} not found`);
    }

    // التحقق من عدم تكرار الكود
    if (data.code && data.code !== existing.code) {
      const existingByCode = await this.prisma.itemCategory.findUnique({
        where: { code: data.code as string },
      });
      if (existingByCode) {
        throw new ConflictException(`Item category with code ${data.code} already exists`);
      }
    }

    // التحقق من عدم جعل الفئة ابنة لنفسها أو لأحد أبنائها
    if (data.parent?.connect?.id) {
      const newParentId = data.parent.connect.id;
      if (newParentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      // التحقق من عدم وجود دورة في الشجرة
      const isDescendant = await this.isDescendant(id, newParentId);
      if (isDescendant) {
        throw new BadRequestException('Cannot set a descendant category as parent');
      }
    }

    return this.prisma.itemCategory.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
      include: {
        parent: true,
      },
    });
  }

  /**
   * التحقق من كون فئة سلف لفئة أخرى
   */
  private async isDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
    const descendant = await this.prisma.itemCategory.findUnique({
      where: { id: descendantId },
    });

    if (!descendant || !descendant.parentId) {
      return false;
    }

    if (descendant.parentId === ancestorId) {
      return true;
    }

    return this.isDescendant(ancestorId, descendant.parentId);
  }

  /**
   * حذف فئة (Soft Delete)
   */
  async remove(id: string, userId?: string) {
    const existing = await this.prisma.itemCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            items: true,
            children: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Item category with ID ${id} not found`);
    }

    if (existing._count.items > 0) {
      throw new BadRequestException('Cannot delete category with existing items. Deactivate instead.');
    }

    if (existing._count.children > 0) {
      throw new BadRequestException('Cannot delete category with child categories. Deactivate instead.');
    }

    return this.prisma.itemCategory.update({
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
    const existing = await this.prisma.itemCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Item category with ID ${id} not found`);
    }

    return this.prisma.itemCategory.update({
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
  async count(where?: Prisma.ItemCategoryWhereInput) {
    return this.prisma.itemCategory.count({ where });
  }
}
