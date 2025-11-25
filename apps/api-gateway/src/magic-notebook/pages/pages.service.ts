import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicPage.findMany();
  }

  async findOne(id: string) {
    return this.prisma.magicPage.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.magicPage.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.magicPage.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.magicPage.delete({ where: { id } });
  }
}
