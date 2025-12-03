/**
 * PHASE 10: Organizational Structure Development
 * Service for managing organizational structure with Prisma
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreatePositionDto,
  UpdatePositionDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '@semop/contracts';

@Injectable()
export class OrganizationalStructureService {
  private prisma = new PrismaClient();

  // ============================================
  // Department Methods
  // ============================================

  async createDepartment(dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: {
        code: dto.code,
        nameAr: dto.nameAr,
        nameEn: dto.nameEn,
        description: dto.description,
        parentDepartmentId: dto.parentDepartmentId,
        managerId: dto.managerId,
        isActive: dto.isActive,
        level: dto.level,
      },
    });
  }

  async getAllDepartments() {
    return this.prisma.department.findMany({
      where: { isActive: true },
      include: {
        parentDepartment: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
          },
        },
        subDepartments: {
          select: {
            id: true,
            code: true,
            nameAr: true,
            nameEn: true,
          },
        },
        employees: {
          select: {
            id: true,
            code: true,
            firstNameAr: true,
            lastNameAr: true,
            email: true,
          },
        },
      },
      orderBy: { level: 'asc' },
    });
  }

  async getDepartmentById(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        parentDepartment: true,
        subDepartments: true,
        employees: true,
      },
    });
  }

  async updateDepartment(id: string, dto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: dto,
    });
  }

  async deleteDepartment(id: string) {
    return this.prisma.department.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getDepartmentHierarchy() {
    const departments = await this.prisma.department.findMany({
      where: { isActive: true },
      include: {
        subDepartments: true,
        employees: {
          select: {
            id: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
      orderBy: { level: 'asc' },
    });

    // Build tree structure
    const buildTree = (parentId: string | null): any[] => {
      return departments
        .filter((d) => d.parentDepartmentId === parentId)
        .map((d) => ({
          ...d,
          children: buildTree(d.id),
        }));
    };

    return buildTree(null);
  }

  // ============================================
  // Position Methods
  // ============================================

  async createPosition(dto: CreatePositionDto) {
    return this.prisma.position.create({
      data: {
        code: dto.code,
        titleAr: dto.titleAr,
        titleEn: dto.titleEn,
        description: dto.description,
        level: dto.level,
        isActive: dto.isActive,
      },
    });
  }

  async getAllPositions() {
    return this.prisma.position.findMany({
      where: { isActive: true },
      include: {
        employees: {
          select: {
            id: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
      orderBy: { level: 'asc' },
    });
  }

  async getPositionById(id: string) {
    return this.prisma.position.findUnique({
      where: { id },
      include: {
        employees: true,
      },
    });
  }

  async updatePosition(id: string, dto: UpdatePositionDto) {
    return this.prisma.position.update({
      where: { id },
      data: dto,
    });
  }

  async deletePosition(id: string) {
    return this.prisma.position.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ============================================
  // Employee Methods
  // ============================================

  async createEmployee(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        code: dto.code,
        firstNameAr: dto.firstNameAr,
        lastNameAr: dto.lastNameAr,
        firstNameEn: dto.firstNameEn,
        lastNameEn: dto.lastNameEn,
        email: dto.email,
        phone: dto.phone,
        departmentId: dto.departmentId,
        positionId: dto.positionId,
        managerId: dto.managerId,
        hireDate: new Date(dto.hireDate),
        salary: dto.salary,
        isActive: dto.isActive,
        userId: dto.userId,
      },
    });
  }

  async getAllEmployees() {
    return this.prisma.employee.findMany({
      where: { isActive: true },
      include: {
        department: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
          },
        },
        position: {
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
          },
        },
        manager: {
          select: {
            id: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmployeeById(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        manager: true,
        subordinates: true,
      },
    });
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto) {
    const data: any = { ...dto };
    if (dto.hireDate) {
      data.hireDate = new Date(dto.hireDate);
    }
    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async deleteEmployee(id: string) {
    return this.prisma.employee.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getEmployeesByDepartment(departmentId: string) {
    return this.prisma.employee.findMany({
      where: {
        departmentId,
        isActive: true,
      },
      include: {
        position: true,
        manager: {
          select: {
            id: true,
            firstNameAr: true,
            lastNameAr: true,
          },
        },
      },
    });
  }

  // ============================================
  // Statistics
  // ============================================

  async getStatistics() {
    const [
      totalDepartments,
      totalPositions,
      totalEmployees,
      activeEmployees,
    ] = await Promise.all([
      this.prisma.department.count({ where: { isActive: true } }),
      this.prisma.position.count({ where: { isActive: true } }),
      this.prisma.employee.count(),
      this.prisma.employee.count({ where: { isActive: true } }),
    ]);

    return {
      totalDepartments,
      totalPositions,
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
    };
  }
}
