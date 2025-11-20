/**
 * SEMOP - Project Service
 * خدمة إدارة المشاريع
 * 
 * @module ProjectService
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Project, Prisma, ProjectStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء مشروع جديد
   * @param data بيانات المشروع
   * @param createdBy معرف المستخدم الذي أنشأ السجل
   * @returns المشروع المُنشأ
   */
  async create(
    data: Prisma.ProjectCreateInput,
    createdBy?: string
  ): Promise<Project> {
    try {
      return await this.prisma.project.create({
        data: {
          ...data,
          createdBy,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Project code already exists');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Unit not found');
        }
      }
      throw error;
    }
  }

  /**
   * البحث عن جميع المشاريع
   * @param params معايير البحث والترتيب
   * @returns قائمة المشاريع
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput;
    include?: Prisma.ProjectInclude;
  } = {}): Promise<Project[]> {
    const { skip, take, where, orderBy, include } = params;

    return this.prisma.project.findMany({
      skip,
      take,
      where,
      orderBy,
      include,
    });
  }

  /**
   * البحث عن جميع المشاريع التابعة لوحدة
   * @param unitId معرف الوحدة
   * @param include العلاقات المطلوبة
   * @returns قائمة المشاريع
   */
  async findByUnit(
    unitId: string,
    include?: Prisma.ProjectInclude
  ): Promise<Project[]> {
    return this.findAll({
      where: { unitId },
      include,
    });
  }

  /**
   * البحث عن جميع المشاريع حسب الحالة
   * @param status حالة المشروع
   * @param include العلاقات المطلوبة
   * @returns قائمة المشاريع
   */
  async findByStatus(
    status: ProjectStatus,
    include?: Prisma.ProjectInclude
  ): Promise<Project[]> {
    return this.findAll({
      where: { status },
      include,
    });
  }

  /**
   * البحث عن مشروع واحد
   * @param id معرف المشروع
   * @param include العلاقات المطلوبة
   * @returns المشروع
   */
  async findOne(
    id: string,
    include?: Prisma.ProjectInclude
  ): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include,
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  /**
   * البحث عن مشروع بالكود
   * @param code كود المشروع
   * @param include العلاقات المطلوبة
   * @returns المشروع
   */
  async findByCode(
    code: string,
    include?: Prisma.ProjectInclude
  ): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { code },
      include,
    });

    if (!project) {
      throw new NotFoundException(`Project with code ${code} not found`);
    }

    return project;
  }

  /**
   * تحديث مشروع
   * @param id معرف المشروع
   * @param data البيانات المحدثة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns المشروع المُحدث
   */
  async update(
    id: string,
    data: Prisma.ProjectUpdateInput,
    updatedBy?: string
  ): Promise<Project> {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: {
          ...data,
          updatedBy,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Project with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Project code already exists');
        }
      }
      throw error;
    }
  }

  /**
   * تغيير حالة المشروع
   * @param id معرف المشروع
   * @param status الحالة الجديدة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns المشروع المُحدث
   */
  async changeStatus(
    id: string,
    status: ProjectStatus,
    updatedBy?: string
  ): Promise<Project> {
    return this.update(id, { status }, updatedBy);
  }

  /**
   * حذف مشروع
   * @param id معرف المشروع
   * @returns المشروع المحذوف
   */
  async remove(id: string): Promise<Project> {
    try {
      return await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Project with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  /**
   * تعطيل مشروع (Soft Delete)
   * @param id معرف المشروع
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns المشروع المُعطل
   */
  async deactivate(id: string, updatedBy?: string): Promise<Project> {
    return this.update(id, { isActive: false }, updatedBy);
  }

  /**
   * تفعيل مشروع
   * @param id معرف المشروع
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns المشروع المُفعل
   */
  async activate(id: string, updatedBy?: string): Promise<Project> {
    return this.update(id, { isActive: true }, updatedBy);
  }

  /**
   * عد المشاريع
   * @param where معايير البحث
   * @returns عدد المشاريع
   */
  async count(where?: Prisma.ProjectWhereInput): Promise<number> {
    return this.prisma.project.count({ where });
  }
}
