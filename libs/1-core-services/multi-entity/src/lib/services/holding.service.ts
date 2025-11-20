/**
 * SEMOP - Holding Service
 * خدمة إدارة الشركات القابضة
 * 
 * @module HoldingService
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Holding, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HoldingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء شركة قابضة جديدة
   * @param data بيانات الشركة القابضة
   * @param createdBy معرف المستخدم الذي أنشأ السجل
   * @returns الشركة القابضة المُنشأة
   */
  async create(
    data: Prisma.HoldingCreateInput,
    createdBy?: string
  ): Promise<Holding> {
    try {
      return await this.prisma.holding.create({
        data: {
          ...data,
          createdBy,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Holding code already exists');
        }
      }
      throw error;
    }
  }

  /**
   * البحث عن جميع الشركات القابضة
   * @param params معايير البحث والترتيب
   * @returns قائمة الشركات القابضة
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.HoldingWhereInput;
    orderBy?: Prisma.HoldingOrderByWithRelationInput;
    include?: Prisma.HoldingInclude;
  } = {}): Promise<Holding[]> {
    const { skip, take, where, orderBy, include } = params;

    return this.prisma.holding.findMany({
      skip,
      take,
      where,
      orderBy,
      include,
    });
  }

  /**
   * البحث عن شركة قابضة واحدة
   * @param id معرف الشركة القابضة
   * @param include العلاقات المطلوبة
   * @returns الشركة القابضة
   */
  async findOne(
    id: string,
    include?: Prisma.HoldingInclude
  ): Promise<Holding> {
    const holding = await this.prisma.holding.findUnique({
      where: { id },
      include,
    });

    if (!holding) {
      throw new NotFoundException(`Holding with ID ${id} not found`);
    }

    return holding;
  }

  /**
   * البحث عن شركة قابضة بالكود
   * @param code كود الشركة القابضة
   * @param include العلاقات المطلوبة
   * @returns الشركة القابضة
   */
  async findByCode(
    code: string,
    include?: Prisma.HoldingInclude
  ): Promise<Holding> {
    const holding = await this.prisma.holding.findUnique({
      where: { code },
      include,
    });

    if (!holding) {
      throw new NotFoundException(`Holding with code ${code} not found`);
    }

    return holding;
  }

  /**
   * تحديث شركة قابضة
   * @param id معرف الشركة القابضة
   * @param data البيانات المحدثة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns الشركة القابضة المُحدثة
   */
  async update(
    id: string,
    data: Prisma.HoldingUpdateInput,
    updatedBy?: string
  ): Promise<Holding> {
    try {
      return await this.prisma.holding.update({
        where: { id },
        data: {
          ...data,
          updatedBy,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Holding with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Holding code already exists');
        }
      }
      throw error;
    }
  }

  /**
   * حذف شركة قابضة
   * ⚠️ سيحذف جميع Units و Projects التابعة (Cascade Delete)
   * @param id معرف الشركة القابضة
   * @returns الشركة القابضة المحذوفة
   */
  async remove(id: string): Promise<Holding> {
    try {
      return await this.prisma.holding.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Holding with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  /**
   * تعطيل شركة قابضة (Soft Delete)
   * @param id معرف الشركة القابضة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns الشركة القابضة المُعطلة
   */
  async deactivate(id: string, updatedBy?: string): Promise<Holding> {
    return this.update(id, { isActive: false }, updatedBy);
  }

  /**
   * تفعيل شركة قابضة
   * @param id معرف الشركة القابضة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns الشركة القابضة المُفعلة
   */
  async activate(id: string, updatedBy?: string): Promise<Holding> {
    return this.update(id, { isActive: true }, updatedBy);
  }

  /**
   * عد الشركات القابضة
   * @param where معايير البحث
   * @returns عدد الشركات القابضة
   */
  async count(where?: Prisma.HoldingWhereInput): Promise<number> {
    return this.prisma.holding.count({ where });
  }
}
