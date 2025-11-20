/**
 * SEMOP - Unit Service
 * خدمة إدارة الوحدات
 * 
 * @module UnitService
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Unit, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء وحدة جديدة
   * @param data بيانات الوحدة
   * @param createdBy معرف المستخدم الذي أنشأ السجل
   * @returns الوحدة المُنشأة
   */
  async create(
    data: Prisma.UnitCreateInput,
    createdBy?: string
  ): Promise<Unit> {
    try {
      return await this.prisma.unit.create({
        data: {
          ...data,
          createdBy,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Unit code already exists');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Holding not found');
        }
      }
      throw error;
    }
  }

  /**
   * البحث عن جميع الوحدات
   * @param params معايير البحث والترتيب
   * @returns قائمة الوحدات
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UnitWhereInput;
    orderBy?: Prisma.UnitOrderByWithRelationInput;
    include?: Prisma.UnitInclude;
  } = {}): Promise<Unit[]> {
    const { skip, take, where, orderBy, include } = params;

    return this.prisma.unit.findMany({
      skip,
      take,
      where,
      orderBy,
      include,
    });
  }

  /**
   * البحث عن جميع الوحدات التابعة لشركة قابضة
   * @param holdingId معرف الشركة القابضة
   * @param include العلاقات المطلوبة
   * @returns قائمة الوحدات
   */
  async findByHolding(
    holdingId: string,
    include?: Prisma.UnitInclude
  ): Promise<Unit[]> {
    return this.findAll({
      where: { holdingId },
      include,
    });
  }

  /**
   * البحث عن وحدة واحدة
   * @param id معرف الوحدة
   * @param include العلاقات المطلوبة
   * @returns الوحدة
   */
  async findOne(
    id: string,
    include?: Prisma.UnitInclude
  ): Promise<Unit> {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include,
    });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return unit;
  }

  /**
   * البحث عن وحدة بالكود
   * @param code كود الوحدة
   * @param include العلاقات المطلوبة
   * @returns الوحدة
   */
  async findByCode(
    code: string,
    include?: Prisma.UnitInclude
  ): Promise<Unit> {
    const unit = await this.prisma.unit.findUnique({
      where: { code },
      include,
    });

    if (!unit) {
      throw new NotFoundException(`Unit with code ${code} not found`);
    }

    return unit;
  }

  /**
   * تحديث وحدة
   * @param id معرف الوحدة
   * @param data البيانات المحدثة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns الوحدة المُحدثة
   */
  async update(
    id: string,
    data: Prisma.UnitUpdateInput,
    updatedBy?: string
  ): Promise<Unit> {
    try {
      return await this.prisma.unit.update({
        where: { id },
        data: {
          ...data,
          updatedBy,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Unit with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Unit code already exists');
        }
      }
      throw error;
    }
  }

  /**
   * حذف وحدة
   * ⚠️ سيحذف جميع Projects التابعة (Cascade Delete)
   * @param id معرف الوحدة
   * @returns الوحدة المحذوفة
   */
  async remove(id: string): Promise<Unit> {
    try {
      return await this.prisma.unit.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Unit with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  /**
   * تعطيل وحدة (Soft Delete)
   * @param id معرف الوحدة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns الوحدة المُعطلة
   */
  async deactivate(id: string, updatedBy?: string): Promise<Unit> {
    return this.update(id, { isActive: false }, updatedBy);
  }

  /**
   * تفعيل وحدة
   * @param id معرف الوحدة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns الوحدة المُفعلة
   */
  async activate(id: string, updatedBy?: string): Promise<Unit> {
    return this.update(id, { isActive: true }, updatedBy);
  }

  /**
   * عد الوحدات
   * @param where معايير البحث
   * @returns عدد الوحدات
   */
  async count(where?: Prisma.UnitWhereInput): Promise<number> {
    return this.prisma.unit.count({ where });
  }
}
