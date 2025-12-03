/**
 * PHASE 10: Organizational Structure Development
 * Controller for organizational structure endpoints
 */

import { Controller, Get, Param } from '@nestjs/common';
import { OrganizationalStructureService } from './organizational-structure.service';

@Controller('organizational-structure')
export class OrganizationalStructureController {
  constructor(
    private readonly organizationalStructureService: OrganizationalStructureService,
  ) {}

  // Departments
  @Get('departments')
  async getAllDepartments() {
    return this.organizationalStructureService.findAllDepartments();
  }

  @Get('departments/:id')
  async getDepartmentById(@Param('id') id: string) {
    return this.organizationalStructureService.findDepartmentById(id);
  }

  @Get('chart')
  async getOrganizationalChart() {
    return this.organizationalStructureService.getOrganizationalChart();
  }

  // Positions
  @Get('positions')
  async getAllPositions() {
    return this.organizationalStructureService.findAllPositions();
  }

  @Get('positions/:id')
  async getPositionById(@Param('id') id: string) {
    return this.organizationalStructureService.findPositionById(id);
  }

  // Employees
  @Get('employees')
  async getAllEmployees() {
    return this.organizationalStructureService.findAllEmployees();
  }

  @Get('employees/:id')
  async getEmployeeById(@Param('id') id: string) {
    return this.organizationalStructureService.findEmployeeById(id);
  }

  @Get('departments/:id/employees')
  async getEmployeesByDepartment(@Param('id') id: string) {
    return this.organizationalStructureService.findEmployeesByDepartment(id);
  }

  // Statistics
  @Get('statistics')
  async getStatistics() {
    return this.organizationalStructureService.getStatistics();
  }
}
