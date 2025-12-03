/**
 * PHASE 10: Organizational Structure Development
 * Employee Entity - represents employees in the organization
 */

export class Employee {
  id: string;
  code: string;
  firstNameAr: string;
  lastNameAr: string;
  firstNameEn?: string;
  lastNameEn?: string;
  email: string;
  phone: string;
  departmentId: string;
  positionId: string;
  managerId?: string; // Direct manager
  hireDate: Date;
  salary?: number;
  isActive: boolean;
  userId?: string; // Link to system user if employee has login
  createdAt: Date;
  updatedAt: Date;
}
