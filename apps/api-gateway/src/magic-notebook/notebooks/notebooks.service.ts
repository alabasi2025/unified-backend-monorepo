import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotebooksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicNotebook.findMany();
  }

  async findOne(id: string) {
    return this.prisma.magicNotebook.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.magicNotebook.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.magicNotebook.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.magicNotebook.delete({ where: { id } });
  }
}
