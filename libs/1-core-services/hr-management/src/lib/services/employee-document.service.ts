import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { EmployeeDocument, Prisma, DocumentType } from '@prisma/client';

@Injectable()
export class EmployeeDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EmployeeDocumentCreateInput): Promise<EmployeeDocument> {
    return this.prisma.employeeDocument.create({ data, include: { employee: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.EmployeeDocumentWhereInput; orderBy?: Prisma.EmployeeDocumentOrderByWithRelationInput;
  }): Promise<{ data: EmployeeDocument[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.employeeDocument.findMany({ skip, take, where, orderBy, include: { employee: true } }),
      this.prisma.employeeDocument.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<EmployeeDocument> {
    const document = await this.prisma.employeeDocument.findUnique({ where: { id }, include: { employee: true } });
    if (!document) throw new NotFoundException(`Document with ID ${id} not found`);
    return document;
  }

  async findByEmployee(employeeId: string): Promise<EmployeeDocument[]> {
    return this.prisma.employeeDocument.findMany({ where: { employeeId }, orderBy: { createdAt: 'desc' } });
  }

  async findByType(employeeId: string, documentType: DocumentType): Promise<EmployeeDocument[]> {
    return this.prisma.employeeDocument.findMany({ where: { employeeId, documentType }, orderBy: { issueDate: 'desc' } });
  }

  async update(id: string, data: Prisma.EmployeeDocumentUpdateInput): Promise<EmployeeDocument> {
    await this.findOne(id);
    return this.prisma.employeeDocument.update({ where: { id }, data });
  }

  async remove(id: string): Promise<EmployeeDocument> {
    await this.findOne(id);
    return this.prisma.employeeDocument.delete({ where: { id } });
  }

  async getExpiringDocuments(days: number): Promise<EmployeeDocument[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return this.prisma.employeeDocument.findMany({
      where: {
        expiryDate: { lte: futureDate, gte: new Date() },
      },
      include: { employee: true },
      orderBy: { expiryDate: 'asc' },
    });
  }

  async count(where?: Prisma.EmployeeDocumentWhereInput): Promise<number> {
    return this.prisma.employeeDocument.count({ where });
  }
}
