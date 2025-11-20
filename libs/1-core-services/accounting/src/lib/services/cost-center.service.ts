/**
 * SEMOP - Cost Center Service
 * خدمة إدارة مراكز التكلفة
 * 
 * @module CostCenterService
 * @version 0.3.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/multi-entity';
import { CostCenter, Prisma } from '@prisma/client';

@Injectable()
export class CostCenterService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء مركز تكلفة جديد
   */
  async create(data: {
    code: string;
    nameAr: string;
    nameEn: string;
    description?: string;
    parentId?: string;
    holdingId?: string;
    unitId?: string;
    projectId?: string;
    createdBy?: string;
  }): Promise<CostCenter> {
    // التحقق من عدم تكرار الكود
    const existingCostCenter = await this.prisma.costCenter.findUnique({
      where: { code: data.code },
    });

    if (existingCostCenter) {
      throw new ConflictException(`Cost center with code ${data.code} already exists`);
    }

    // التحقق من وجود المركز الأب إذا تم تحديده
    if (data.parentId) {
      const parent = await this.prisma.costCenter.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new NotFoundException(`Parent cost center with ID ${data.parentId} not found`);
      }
    }

    return this.prisma.costCenter.create({
      data: {
        code: data.code,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        description: data.description,
        parentId: data.parentId,
        holdingId: data.holdingId,
        unitId: data.unitId,
        projectId: data.projectId,
        createdBy: data.createdBy,
      },
    });
  }

  /**
   * الحصول على جميع مراكز التكلفة
   */
  async findAll(filters?: {
    isActive?: boolean;
    holdingId?: string;
    unitId?: string;
    projectId?: string;
  }): Promise<CostCenter[]> {
    const where: Prisma.CostCenterWhereInput = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.holdingId) {
      where.holdingId = filters.holdingId;
    }

    if (filters?.unitId) {
      where.unitId = filters.unitId;
    }

    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    return this.prisma.costCenter.findMany({
      where,
      include: {
        parent: true,
        children: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  /**
   * الحصول على مركز تكلفة بالمعرف
   */
  async findOne(id: string): Promise<CostCenter> {
    const costCenter = await this.prisma.costCenter.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        journalEntryLines: {
          include: {
            journalEntry: true,
            account: true,
          },
        },
      },
    });

    if (!costCenter) {
      throw new NotFoundException(`Cost center with ID ${id} not found`);
    }

    return costCenter;
  }

  /**
   * الحصول على مركز تكلفة بالكود
   */
  async findByCode(code: string): Promise<CostCenter> {
    const costCenter = await this.prisma.costCenter.findUnique({
      where: { code },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!costCenter) {
      throw new NotFoundException(`Cost center with code ${code} not found`);
    }

    return costCenter;
  }

  /**
   * تحديث مركز تكلفة
   */
  async update(
    id: string,
    data: {
      code?: string;
      nameAr?: string;
      nameEn?: string;
      description?: string;
      isActive?: boolean;
      updatedBy?: string;
    }
  ): Promise<CostCenter> {
    const costCenter = await this.findOne(id);

    // التحقق من عدم تكرار الكود إذا تم تغييره
    if (data.code && data.code !== costCenter.code) {
      const existingCostCenter = await this.prisma.costCenter.findUnique({
        where: { code: data.code },
      });

      if (existingCostCenter) {
        throw new ConflictException(`Cost center with code ${data.code} already exists`);
      }
    }

    return this.prisma.costCenter.update({
      where: { id },
      data: {
        code: data.code,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        description: data.description,
        isActive: data.isActive,
        updatedBy: data.updatedBy,
      },
    });
  }

  /**
   * حذف مركز تكلفة (Soft Delete)
   */
  async remove(id: string, userId?: string): Promise<CostCenter> {
    const costCenter = await this.findOne(id);

    // التحقق من عدم وجود مراكز فرعية
    if (costCenter.children && costCenter.children.length > 0) {
      throw new BadRequestException('Cannot delete cost center with child cost centers');
    }

    // التحقق من عدم وجود قيود محاسبية
    const journalEntryLinesCount = await this.prisma.journalEntryLine.count({
      where: { costCenterId: id },
    });

    if (journalEntryLinesCount > 0) {
      throw new BadRequestException('Cannot delete cost center with journal entry lines');
    }

    return this.prisma.costCenter.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: userId,
      },
    });
  }

  /**
   * تفعيل مركز تكلفة
   */
  async activate(id: string, userId?: string): Promise<CostCenter> {
    await this.findOne(id);

    return this.prisma.costCenter.update({
      where: { id },
      data: {
        isActive: true,
        updatedBy: userId,
      },
    });
  }

  /**
   * عد مراكز التكلفة
   */
  async count(filters?: {
    isActive?: boolean;
  }): Promise<number> {
    const where: Prisma.CostCenterWhereInput = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.costCenter.count({ where });
  }

  /**
   * الحصول على المراكز الفرعية
   */
  async getChildren(parentId: string): Promise<CostCenter[]> {
    await this.findOne(parentId);

    return this.prisma.costCenter.findMany({
      where: { parentId },
      include: {
        children: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }
}
