import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArchiveService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicArchive.findMany();
  }

  async findOne(id: string) {
    return this.prisma.magicArchive.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.magicArchive.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.magicArchive.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.magicArchive.delete({ where: { id } });
  }
}
