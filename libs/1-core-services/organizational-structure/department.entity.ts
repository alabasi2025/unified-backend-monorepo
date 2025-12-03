/**
 * PHASE 10: Organizational Structure Development
 * Department Entity - represents organizational departments
 */

export class Department {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  parentDepartmentId?: string;
  managerId?: string;
  isActive: boolean;
  level: number; // 1 = top level, 2 = sub-department, etc.
  createdAt: Date;
  updatedAt: Date;
}
