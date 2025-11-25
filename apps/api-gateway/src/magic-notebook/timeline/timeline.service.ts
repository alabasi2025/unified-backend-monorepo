import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicTimelineEvent.findMany();
  }

  async findOne(id: string) {
    return this.prisma.magicTimelineEvent.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.magicTimelineEvent.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.magicTimelineEvent.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.magicTimelineEvent.delete({ where: { id } });
  }
}
