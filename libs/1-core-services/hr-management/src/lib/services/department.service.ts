import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { Department, Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء قسم جديد
   */
  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    // التحقق من عدم تكرار الكود
    const existing = await this.prisma.department.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      throw new ConflictException(`Department with code ${data.code} already exists`);
    }

    // التحقق من وجود القسم الأب
    if (data.parent?.connect?.id) {
      const parent = await this.prisma.department.findUnique({
        where: { id: data.parent.connect.id },
      });
      if (!parent) {
        throw new NotFoundException('Parent department not found');
      }
    }

    return this.prisma.department.create({
      data,
      include: {
        parent: true,
        manager: true,
        costCenter: true,
        holding: true,
        unit: true,
        project: true,
      },
    });
  }

  /**
   * الحصول على جميع الأقسام
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.DepartmentWhereInput;
    orderBy?: Prisma.DepartmentOrderByWithRelationInput;
  }): Promise<{ data: Department[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};

    const [data, total] = await Promise.all([
      this.prisma.department.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          parent: true,
          manager: true,
          costCenter: true,
          holding: true,
          unit: true,
          project: true,
        },
      }),
      this.prisma.department.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * الحصول على قسم واحد
   */
  async findOne(id: string): Promise<Department> {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        manager: true,
        costCenter: true,
        holding: true,
        unit: true,
        project: true,
        employees: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  /**
   * الحصول على قسم بالكود
   */
  async findByCode(code: string): Promise<Department> {
    const department = await this.prisma.department.findUnique({
      where: { code },
      include: {
        parent: true,
        children: true,
        manager: true,
        employees: true,
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with code ${code} not found`);
    }

    return department;
  }

  /**
   * تحديث قسم
   */
  async update(id: string, data: Prisma.DepartmentUpdateInput): Promise<Department> {
    await this.findOne(id);

    // التحقق من عدم تكرار الكود
    if (data.code) {
      const existing = await this.prisma.department.findFirst({
        where: {
          code: data.code as string,
          NOT: { id },
        },
      });
      if (existing) {
        throw new ConflictException(`Department with code ${data.code} already exists`);
      }
    }

    return this.prisma.department.update({
      where: { id },
      data,
      include: {
        parent: true,
        manager: true,
        costCenter: true,
      },
    });
  }

  /**
   * حذف قسم (Soft Delete)
   */
  async remove(id: string): Promise<Department> {
    await this.findOne(id);

    // التحقق من وجود أقسام فرعية
    const childrenCount = await this.prisma.department.count({
      where: { parentId: id },
    });
    if (childrenCount > 0) {
      throw new BadRequestException('Cannot delete department with children');
    }

    // التحقق من وجود موظفين
    const employeesCount = await this.prisma.employee.count({
      where: { departmentId: id },
    });
    if (employeesCount > 0) {
      throw new BadRequestException('Cannot delete department with employees');
    }

    return this.prisma.department.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * تفعيل قسم
   */
  async activate(id: string): Promise<Department> {
    await this.findOne(id);

    return this.prisma.department.update({
      where: { id },
      data: { isActive: true },
    });
  }

  /**
   * إلغاء تفعيل قسم
   */
  async deactivate(id: string): Promise<Department> {
    await this.findOne(id);

    return this.prisma.department.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * الحصول على الأقسام الفرعية
   */
  async getChildren(id: string): Promise<Department[]> {
    await this.findOne(id);

    return this.prisma.department.findMany({
      where: { parentId: id },
      include: {
        manager: true,
        employees: true,
      },
    });
  }

  /**
   * الحصول على جميع الأقسام الفرعية (بشكل تكراري)
   */
  async getAllDescendants(id: string): Promise<Department[]> {
    const descendants: Department[] = [];
    const queue = [id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = await this.prisma.department.findMany({
        where: { parentId: currentId },
      });

      descendants.push(...children);
      queue.push(...children.map((c) => c.id));
    }

    return descendants;
  }

  /**
   * الحصول على الهيكل الشجري للأقسام
   */
  async getTree(holdingId?: string, unitId?: string): Promise<Department[]> {
    const where: Prisma.DepartmentWhereInput = {
      parentId: null,
    };

    if (holdingId) where.holdingId = holdingId;
    if (unitId) where.unitId = unitId;

    const rootDepartments = await this.prisma.department.findMany({
      where,
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
        manager: true,
      },
    });

    return rootDepartments;
  }

  /**
   * عدد الموظفين في القسم
   */
  async getEmployeeCount(id: string): Promise<number> {
    await this.findOne(id);

    return this.prisma.employee.count({
      where: { departmentId: id },
    });
  }

  /**
   * تعيين مدير للقسم
   */
  async assignManager(id: string, managerId: string): Promise<Department> {
    await this.findOne(id);

    // التحقق من وجود الموظف
    const manager = await this.prisma.employee.findUnique({
      where: { id: managerId },
    });
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    return this.prisma.department.update({
      where: { id },
      data: { managerId },
      include: {
        manager: true,
      },
    });
  }

  /**
   * إزالة مدير القسم
   */
  async removeManager(id: string): Promise<Department> {
    await this.findOne(id);

    return this.prisma.department.update({
      where: { id },
      data: { managerId: null },
    });
  }

  /**
   * ربط القسم بمركز تكلفة
   */
  async assignCostCenter(id: string, costCenterId: string): Promise<Department> {
    await this.findOne(id);

    // التحقق من وجود مركز التكلفة
    const costCenter = await this.prisma.costCenter.findUnique({
      where: { id: costCenterId },
    });
    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }

    return this.prisma.department.update({
      where: { id },
      data: { costCenterId },
      include: {
        costCenter: true,
      },
    });
  }

  /**
   * البحث عن الأقسام
   */
  async search(query: string): Promise<Department[]> {
    return this.prisma.department.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { nameEn: { contains: query, mode: 'insensitive' } },
          { nameAr: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: 20,
      include: {
        parent: true,
        manager: true,
      },
    });
  }

  /**
   * عدد الأقسام
   */
  async count(where?: Prisma.DepartmentWhereInput): Promise<number> {
    return this.prisma.department.count({ where });
  }
}
