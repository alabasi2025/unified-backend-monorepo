import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicSection.findMany();
  }

  async findOne(id: string) {
    return this.prisma.magicSection.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.magicSection.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.magicSection.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.magicSection.delete({ where: { id } });
  }
}
