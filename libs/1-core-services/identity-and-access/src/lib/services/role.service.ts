/**
 * SEMOP - Role Service
 * خدمة إدارة الأدوار
 * 
 * @module RoleService
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Role, Prisma } from '@prisma/client';
import { PrismaService } from '@semop/multi-entity';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء دور جديد
   * @param data بيانات الدور
   * @returns الدور المُنشأ
   */
  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    try {
      return await this.prisma.role.create({
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Role code already exists');
        }
      }
      throw error;
    }
  }

  /**
   * البحث عن جميع الأدوار
   * @param params معايير البحث والترتيب
   * @returns قائمة الأدوار
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
    include?: Prisma.RoleInclude;
  } = {}): Promise<Role[]> {
    const { skip, take, where, orderBy, include } = params;

    return this.prisma.role.findMany({
      skip,
      take,
      where,
      orderBy,
      include,
    });
  }

  /**
   * البحث عن دور واحد
   * @param id معرف الدور
   * @param include العلاقات المطلوبة
   * @returns الدور
   */
  async findOne(
    id: string,
    include?: Prisma.RoleInclude
  ): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include,
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  /**
   * البحث عن دور بالكود
   * @param code كود الدور
   * @param include العلاقات المطلوبة
   * @returns الدور
   */
  async findByCode(
    code: string,
    include?: Prisma.RoleInclude
  ): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { code },
      include,
    });

    if (!role) {
      throw new NotFoundException(`Role with code ${code} not found`);
    }

    return role;
  }

  /**
   * تحديث دور
   * @param id معرف الدور
   * @param data البيانات المحدثة
   * @returns الدور المُحدث
   */
  async update(
    id: string,
    data: Prisma.RoleUpdateInput
  ): Promise<Role> {
    // التحقق من أن الدور ليس دور نظام
    const role = await this.findOne(id);
    if (role.isSystem && data.code !== undefined) {
      throw new BadRequestException('Cannot modify system role code');
    }

    try {
      return await this.prisma.role.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Role with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Role code already exists');
        }
      }
      throw error;
    }
  }

  /**
   * حذف دور
   * ⚠️ لا يمكن حذف أدوار النظام
   * @param id معرف الدور
   * @returns الدور المحذوف
   */
  async remove(id: string): Promise<Role> {
    // التحقق من أن الدور ليس دور نظام
    const role = await this.findOne(id);
    if (role.isSystem) {
      throw new BadRequestException('Cannot delete system role');
    }

    try {
      return await this.prisma.role.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Role with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  /**
   * تعطيل دور (Soft Delete)
   * @param id معرف الدور
   * @returns الدور المُعطل
   */
  async deactivate(id: string): Promise<Role> {
    return this.update(id, { isActive: false });
  }

  /**
   * تفعيل دور
   * @param id معرف الدور
   * @returns الدور المُفعل
   */
  async activate(id: string): Promise<Role> {
    return this.update(id, { isActive: true });
  }

  /**
   * إضافة صلاحية لدور
   * @param roleId معرف الدور
   * @param permissionId معرف الصلاحية
   * @param assignedBy معرف المستخدم الذي أضاف الصلاحية
   */
  async addPermission(
    roleId: string,
    permissionId: string,
    assignedBy?: string
  ): Promise<void> {
    try {
      await this.prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
          assignedBy,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Permission already assigned to this role');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Role or Permission not found');
        }
      }
      throw error;
    }
  }

  /**
   * إزالة صلاحية من دور
   * @param roleId معرف الدور
   * @param permissionId معرف الصلاحية
   */
  async removePermission(
    roleId: string,
    permissionId: string
  ): Promise<void> {
    try {
      await this.prisma.rolePermission.deleteMany({
        where: {
          roleId,
          permissionId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * الحصول على جميع صلاحيات دور
   * @param roleId معرف الدور
   * @returns قائمة الصلاحيات
   */
  async getPermissions(roleId: string) {
    const role = await this.findOne(roleId, {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    });

    return role.rolePermissions.map(rp => rp.permission);
  }

  /**
   * عد الأدوار
   * @param where معايير البحث
   * @returns عدد الأدوار
   */
  async count(where?: Prisma.RoleWhereInput): Promise<number> {
    return this.prisma.role.count({ where });
  }

  /**
   * إنشاء أدوار النظام الأساسية
   * يتم استدعاؤها عند أول تشغيل للنظام
   */
  async seedSystemRoles(): Promise<void> {
    const systemRoles = [
      {
        code: 'SUPER_ADMIN',
        nameAr: 'مدير النظام الكامل',
        nameEn: 'Super Administrator',
        description: 'Full system access with all permissions',
        isSystem: true,
      },
      {
        code: 'HOLDING_ADMIN',
        nameAr: 'مدير الشركة القابضة',
        nameEn: 'Holding Administrator',
        description: 'Administrator for holding company level',
        isSystem: true,
      },
      {
        code: 'UNIT_ADMIN',
        nameAr: 'مدير الوحدة',
        nameEn: 'Unit Administrator',
        description: 'Administrator for unit level',
        isSystem: true,
      },
      {
        code: 'PROJECT_ADMIN',
        nameAr: 'مدير المشروع',
        nameEn: 'Project Administrator',
        description: 'Administrator for project level',
        isSystem: true,
      },
      {
        code: 'ACCOUNTANT',
        nameAr: 'محاسب',
        nameEn: 'Accountant',
        description: 'Access to accounting and financial modules',
        isSystem: true,
      },
      {
        code: 'WAREHOUSE_KEEPER',
        nameAr: 'أمين مستودع',
        nameEn: 'Warehouse Keeper',
        description: 'Access to inventory and warehouse modules',
        isSystem: true,
      },
      {
        code: 'EMPLOYEE',
        nameAr: 'موظف',
        nameEn: 'Employee',
        description: 'Basic employee access',
        isSystem: true,
      },
      {
        code: 'VIEWER',
        nameAr: 'مشاهد',
        nameEn: 'Viewer',
        description: 'Read-only access',
        isSystem: true,
      },
    ];

    for (const roleData of systemRoles) {
      try {
        await this.create(roleData);
      } catch (error) {
        // تجاهل الخطأ إذا كان الدور موجود مسبقاً
        if (!(error instanceof ConflictException)) {
          throw error;
        }
      }
    }
  }
}
