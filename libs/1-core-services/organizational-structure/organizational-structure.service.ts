/**
 * PHASE 10: Organizational Structure Development
 * Service for managing organizational structure (departments, employees, positions)
 */

import { Injectable } from '@nestjs/common';
import { Department } from './department.entity';
import { Employee } from './employee.entity';
import { Position } from './position.entity';

@Injectable()
export class OrganizationalStructureService {
  // Mock data for now - will be replaced with Prisma later
  private departments: Department[] = [
    {
      id: '1',
      code: 'EXEC',
      nameAr: 'الإدارة التنفيذية',
      nameEn: 'Executive Management',
      description: 'الإدارة العليا للشركة',
      isActive: true,
      level: 1,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '2',
      code: 'FIN',
      nameAr: 'الإدارة المالية',
      nameEn: 'Finance Department',
      description: 'إدارة الشؤون المالية والمحاسبة',
      parentDepartmentId: '1',
      isActive: true,
      level: 2,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '3',
      code: 'HR',
      nameAr: 'الموارد البشرية',
      nameEn: 'Human Resources',
      description: 'إدارة شؤون الموظفين',
      parentDepartmentId: '1',
      isActive: true,
      level: 2,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '4',
      code: 'IT',
      nameAr: 'تقنية المعلومات',
      nameEn: 'Information Technology',
      description: 'إدارة الأنظمة والتقنية',
      parentDepartmentId: '1',
      isActive: true,
      level: 2,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '5',
      code: 'SALES',
      nameAr: 'المبيعات',
      nameEn: 'Sales Department',
      description: 'إدارة المبيعات والعملاء',
      parentDepartmentId: '1',
      isActive: true,
      level: 2,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
  ];

  private positions: Position[] = [
    {
      id: '1',
      code: 'CEO',
      titleAr: 'المدير التنفيذي',
      titleEn: 'Chief Executive Officer',
      level: 1,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '2',
      code: 'CFO',
      titleAr: 'المدير المالي',
      titleEn: 'Chief Financial Officer',
      level: 1,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '3',
      code: 'MGR',
      titleAr: 'مدير',
      titleEn: 'Manager',
      level: 2,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '4',
      code: 'STAFF',
      titleAr: 'موظف',
      titleEn: 'Staff',
      level: 3,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
  ];

  private employees: Employee[] = [
    {
      id: '1',
      code: 'EMP-001',
      firstNameAr: 'أحمد',
      lastNameAr: 'محمد',
      firstNameEn: 'Ahmed',
      lastNameEn: 'Mohammed',
      email: 'ahmed.mohammed@semop.com',
      phone: '+967771234567',
      departmentId: '1',
      positionId: '1',
      hireDate: new Date('2020-01-01'),
      salary: 5000,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '2',
      code: 'EMP-002',
      firstNameAr: 'فاطمة',
      lastNameAr: 'علي',
      firstNameEn: 'Fatima',
      lastNameEn: 'Ali',
      email: 'fatima.ali@semop.com',
      phone: '+967771234568',
      departmentId: '2',
      positionId: '2',
      managerId: '1',
      hireDate: new Date('2021-03-15'),
      salary: 4000,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '3',
      code: 'EMP-003',
      firstNameAr: 'خالد',
      lastNameAr: 'حسن',
      firstNameEn: 'Khaled',
      lastNameEn: 'Hassan',
      email: 'khaled.hassan@semop.com',
      phone: '+967771234569',
      departmentId: '3',
      positionId: '3',
      managerId: '1',
      hireDate: new Date('2021-06-01'),
      salary: 3000,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
  ];

  // Departments
  async findAllDepartments(): Promise<Department[]> {
    return this.departments;
  }

  async findDepartmentById(id: string): Promise<Department | null> {
    return this.departments.find((d) => d.id === id) || null;
  }

  async getOrganizationalChart(): Promise<any> {
    // Build hierarchical structure
    const buildTree = (parentId?: string): any[] => {
      return this.departments
        .filter((d) => d.parentDepartmentId === parentId)
        .map((dept) => ({
          ...dept,
          children: buildTree(dept.id),
          employeeCount: this.employees.filter(
            (e) => e.departmentId === dept.id,
          ).length,
        }));
    };

    return buildTree();
  }

  // Positions
  async findAllPositions(): Promise<Position[]> {
    return this.positions;
  }

  async findPositionById(id: string): Promise<Position | null> {
    return this.positions.find((p) => p.id === id) || null;
  }

  // Employees
  async findAllEmployees(): Promise<Employee[]> {
    return this.employees;
  }

  async findEmployeeById(id: string): Promise<Employee | null> {
    return this.employees.find((e) => e.id === id) || null;
  }

  async findEmployeesByDepartment(departmentId: string): Promise<Employee[]> {
    return this.employees.filter((e) => e.departmentId === departmentId);
  }

  // Statistics
  async getStatistics(): Promise<any> {
    return {
      totalDepartments: this.departments.length,
      activeDepartments: this.departments.filter((d) => d.isActive).length,
      totalEmployees: this.employees.length,
      activeEmployees: this.employees.filter((e) => e.isActive).length,
      totalPositions: this.positions.length,
      departmentDistribution: this.departments.map((dept) => ({
        departmentId: dept.id,
        departmentName: dept.nameAr,
        employeeCount: this.employees.filter(
          (e) => e.departmentId === dept.id,
        ).length,
      })),
    };
  }
}
