import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicTask.findMany();
  }

  async findOne(id: string) {
    return this.prisma.magicTask.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.magicTask.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.magicTask.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.magicTask.delete({ where: { id } });
  }
}
