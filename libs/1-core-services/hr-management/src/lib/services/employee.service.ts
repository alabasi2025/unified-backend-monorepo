import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { Employee, Prisma, EmploymentStatus } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
    const existing = await this.prisma.employee.findFirst({
      where: {
        OR: [
          { code: data.code },
          { nationalId: data.nationalId },
          { email: data.email },
        ],
      },
    });
    if (existing) {
      throw new ConflictException('Employee with same code, national ID, or email already exists');
    }

    return this.prisma.employee.create({
      data,
      include: {
        department: true,
        position: true,
        manager: true,
        workLocation: true,
        holding: true,
        unit: true,
        project: true,
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.EmployeeWhereInput;
    orderBy?: Prisma.EmployeeOrderByWithRelationInput;
  }): Promise<{ data: Employee[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};

    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          department: true,
          position: true,
          manager: true,
          workLocation: true,
        },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        manager: true,
        subordinates: true,
        workLocation: true,
        holding: true,
        unit: true,
        project: true,
        documents: { take: 10 },
        contracts: { take: 5 },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async findByCode(code: string): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: { code },
      include: {
        department: true,
        position: true,
        manager: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with code ${code} not found`);
    }

    return employee;
  }

  async findByNationalId(nationalId: string): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: { nationalId },
      include: {
        department: true,
        position: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with national ID ${nationalId} not found`);
    }

    return employee;
  }

  async findByEmail(email: string): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: { email },
      include: {
        department: true,
        position: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with email ${email} not found`);
    }

    return employee;
  }

  async update(id: string, data: Prisma.EmployeeUpdateInput): Promise<Employee> {
    await this.findOne(id);

    if (data.code || data.nationalId || data.email) {
      const existing = await this.prisma.employee.findFirst({
        where: {
          OR: [
            data.code ? { code: data.code as string } : {},
            data.nationalId ? { nationalId: data.nationalId as string } : {},
            data.email ? { email: data.email as string } : {},
          ],
          NOT: { id },
        },
      });
      if (existing) {
        throw new ConflictException('Employee with same code, national ID, or email already exists');
      }
    }

    return this.prisma.employee.update({
      where: { id },
      data,
      include: {
        department: true,
        position: true,
        manager: true,
      },
    });
  }

  async remove(id: string): Promise<Employee> {
    await this.findOne(id);

    return this.prisma.employee.update({
      where: { id },
      data: { isActive: false, employmentStatus: EmploymentStatus.TERMINATED },
    });
  }

  async activate(id: string): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: { isActive: true, employmentStatus: EmploymentStatus.ACTIVE },
    });
  }

  async deactivate(id: string): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async assignDepartment(id: string, departmentId: string): Promise<Employee> {
    await this.findOne(id);

    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return this.prisma.employee.update({
      where: { id },
      data: { departmentId },
      include: { department: true },
    });
  }

  async assignPosition(id: string, positionId: string): Promise<Employee> {
    await this.findOne(id);

    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
    });
    if (!position) {
      throw new NotFoundException('Position not found');
    }

    return this.prisma.employee.update({
      where: { id },
      data: { positionId },
      include: { position: true },
    });
  }

  async assignManager(id: string, managerId: string): Promise<Employee> {
    await this.findOne(id);

    if (id === managerId) {
      throw new BadRequestException('Employee cannot be their own manager');
    }

    const manager = await this.prisma.employee.findUnique({
      where: { id: managerId },
    });
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    return this.prisma.employee.update({
      where: { id },
      data: { managerId },
      include: { manager: true },
    });
  }

  async removeManager(id: string): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: { managerId: null },
    });
  }

  async getSubordinates(id: string): Promise<Employee[]> {
    await this.findOne(id);
    return this.prisma.employee.findMany({
      where: { managerId: id },
      include: {
        department: true,
        position: true,
      },
    });
  }

  async getByDepartment(departmentId: string): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { departmentId, isActive: true },
      include: {
        position: true,
        manager: true,
      },
    });
  }

  async getByPosition(positionId: string): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { positionId, isActive: true },
      include: {
        department: true,
        manager: true,
      },
    });
  }

  async getByStatus(status: EmploymentStatus): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { employmentStatus: status },
      include: {
        department: true,
        position: true,
      },
    });
  }

  async terminate(id: string, terminationDate: Date): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: {
        employmentStatus: EmploymentStatus.TERMINATED,
        terminationDate,
        isActive: false,
      },
    });
  }

  async resign(id: string, terminationDate: Date): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: {
        employmentStatus: EmploymentStatus.RESIGNED,
        terminationDate,
        isActive: false,
      },
    });
  }

  async retire(id: string, terminationDate: Date): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: {
        employmentStatus: EmploymentStatus.RETIRED,
        terminationDate,
        isActive: false,
      },
    });
  }

  async suspend(id: string): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: { employmentStatus: EmploymentStatus.SUSPENDED },
    });
  }

  async unsuspend(id: string): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: { employmentStatus: EmploymentStatus.ACTIVE },
    });
  }

  async search(query: string): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { firstNameAr: { contains: query, mode: 'insensitive' } },
          { lastNameAr: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { nationalId: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: 20,
      include: {
        department: true,
        position: true,
      },
    });
  }

  async count(where?: Prisma.EmployeeWhereInput): Promise<number> {
    return this.prisma.employee.count({ where });
  }

  async getActiveCount(): Promise<number> {
    return this.prisma.employee.count({
      where: { employmentStatus: EmploymentStatus.ACTIVE, isActive: true },
    });
  }

  async getBirthdaysThisMonth(): Promise<Employee[]> {
    const now = new Date();
    const month = now.getMonth() + 1;

    return this.prisma.employee.findMany({
      where: {
        isActive: true,
      },
      include: {
        department: true,
        position: true,
      },
    });
  }
}
