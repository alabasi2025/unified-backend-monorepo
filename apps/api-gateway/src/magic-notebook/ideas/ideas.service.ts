import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IdeasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicIdea.findMany();
  }

  async findOne(id: string) {
    return this.prisma.magicIdea.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.magicIdea.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.magicIdea.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.magicIdea.delete({ where: { id } });
  }
}
