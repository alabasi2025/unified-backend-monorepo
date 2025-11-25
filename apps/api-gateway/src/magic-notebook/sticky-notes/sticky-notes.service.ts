import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StickyNotesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicStickyNote.findMany();
  }

  async findOne(id: string) {
    return this.prisma.magicStickyNote.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.magicStickyNote.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.magicStickyNote.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.magicStickyNote.delete({ where: { id } });
  }
}
