import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicReport.findMany();
  }

  async findOne(id: string) {
    return this.prisma.magicReport.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.magicReport.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.magicReport.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.magicReport.delete({ where: { id } });
  }
}
