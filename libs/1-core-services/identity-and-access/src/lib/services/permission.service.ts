/**
 * SEMOP - Permission Service
 * خدمة إدارة الصلاحيات
 * 
 * @module PermissionService
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Permission, Prisma } from '@prisma/client';
import { PrismaService } from '@semop/multi-entity';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء صلاحية جديدة
   * @param data بيانات الصلاحية
   * @returns الصلاحية المُنشأة
   */
  async create(data: Prisma.PermissionCreateInput): Promise<Permission> {
    try {
      return await this.prisma.permission.create({
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Permission code or module/action combination already exists');
        }
      }
      throw error;
    }
  }

  /**
   * البحث عن جميع الصلاحيات
   * @param params معايير البحث والترتيب
   * @returns قائمة الصلاحيات
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PermissionWhereInput;
    orderBy?: Prisma.PermissionOrderByWithRelationInput;
    include?: Prisma.PermissionInclude;
  } = {}): Promise<Permission[]> {
    const { skip, take, where, orderBy, include } = params;

    return this.prisma.permission.findMany({
      skip,
      take,
      where,
      orderBy,
      include,
    });
  }

  /**
   * البحث عن جميع الصلاحيات حسب الوحدة
   * @param module اسم الوحدة
   * @returns قائمة الصلاحيات
   */
  async findByModule(module: string): Promise<Permission[]> {
    return this.findAll({
      where: { module },
      orderBy: { action: 'asc' },
    });
  }

  /**
   * البحث عن صلاحية واحدة
   * @param id معرف الصلاحية
   * @param include العلاقات المطلوبة
   * @returns الصلاحية
   */
  async findOne(
    id: string,
    include?: Prisma.PermissionInclude
  ): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include,
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  /**
   * البحث عن صلاحية بالكود
   * @param code كود الصلاحية
   * @param include العلاقات المطلوبة
   * @returns الصلاحية
   */
  async findByCode(
    code: string,
    include?: Prisma.PermissionInclude
  ): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({
      where: { code },
      include,
    });

    if (!permission) {
      throw new NotFoundException(`Permission with code ${code} not found`);
    }

    return permission;
  }

  /**
   * البحث عن صلاحية بالوحدة والإجراء
   * @param module اسم الوحدة
   * @param action الإجراء
   * @returns الصلاحية
   */
  async findByModuleAndAction(
    module: string,
    action: string
  ): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({
      where: {
        module_action: {
          module,
          action,
        },
      },
    });

    if (!permission) {
      throw new NotFoundException(`Permission for ${module}.${action} not found`);
    }

    return permission;
  }

  /**
   * تحديث صلاحية
   * @param id معرف الصلاحية
   * @param data البيانات المحدثة
   * @returns الصلاحية المُحدثة
   */
  async update(
    id: string,
    data: Prisma.PermissionUpdateInput
  ): Promise<Permission> {
    try {
      return await this.prisma.permission.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Permission code or module/action combination already exists');
        }
      }
      throw error;
    }
  }

  /**
   * حذف صلاحية
   * @param id معرف الصلاحية
   * @returns الصلاحية المحذوفة
   */
  async remove(id: string): Promise<Permission> {
    try {
      return await this.prisma.permission.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Permission with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  /**
   * عد الصلاحيات
   * @param where معايير البحث
   * @returns عدد الصلاحيات
   */
  async count(where?: Prisma.PermissionWhereInput): Promise<number> {
    return this.prisma.permission.count({ where });
  }

  /**
   * إنشاء الصلاحيات الأساسية للنظام
   * يتم استدعاؤها عند أول تشغيل للنظام
   */
  async seedSystemPermissions(): Promise<void> {
    const modules = [
      'users',
      'roles',
      'permissions',
      'holdings',
      'units',
      'projects',
      'accounting',
      'inventory',
      'assets',
      'crm',
      'tasks',
      'configurations',
    ];

    const actions = ['create', 'read', 'update', 'delete'];

    for (const module of modules) {
      for (const action of actions) {
        const code = `${module.toUpperCase()}_${action.toUpperCase()}`;
        const nameAr = this.getArabicPermissionName(module, action);
        const nameEn = `${this.capitalizeFirst(action)} ${this.capitalizeFirst(module)}`;

        try {
          await this.create({
            code,
            nameAr,
            nameEn,
            description: `Permission to ${action} ${module}`,
            module,
            action,
          });
        } catch (error) {
          // تجاهل الخطأ إذا كانت الصلاحية موجودة مسبقاً
          if (!(error instanceof ConflictException)) {
            throw error;
          }
        }
      }
    }
  }

  /**
   * الحصول على الاسم العربي للصلاحية
   * @param module اسم الوحدة
   * @param action الإجراء
   * @returns الاسم العربي
   */
  private getArabicPermissionName(module: string, action: string): string {
    const moduleNames: Record<string, string> = {
      users: 'المستخدمين',
      roles: 'الأدوار',
      permissions: 'الصلاحيات',
      holdings: 'الشركات القابضة',
      units: 'الوحدات',
      projects: 'المشاريع',
      accounting: 'المحاسبة',
      inventory: 'المخزون',
      assets: 'الأصول',
      crm: 'إدارة العملاء',
      tasks: 'المهام',
      configurations: 'الإعدادات',
    };

    const actionNames: Record<string, string> = {
      create: 'إنشاء',
      read: 'قراءة',
      update: 'تعديل',
      delete: 'حذف',
    };

    return `${actionNames[action]} ${moduleNames[module]}`;
  }

  /**
   * تحويل أول حرف إلى حرف كبير
   * @param str النص
   * @returns النص مع أول حرف كبير
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
