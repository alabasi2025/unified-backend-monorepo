import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotebooksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.magicNotebook.findMany({
      include: {
        user: { select: { id: true, username: true } },
        sections: { include: { pages: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.magicNotebook.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        sections: {
          include: {
            pages: { orderBy: { createdAt: 'asc' } }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  async create(data: { title: string; description?: string; userId: string; createdBy: string }) {
    return this.prisma.magicNotebook.create({
      data: {
        title: data.title,
        description: data.description,
        createdBy: data.createdBy || data.userId,
        user: { connect: { id: data.userId } }
      },
      include: {
        user: { select: { id: true, username: true } }
      }
    });
  }

  async update(id: string, data: { title?: string; description?: string }) {
    return this.prisma.magicNotebook.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, username: true } }
      }
    });
  }

  async remove(id: string) {
    return this.prisma.magicNotebook.delete({ where: { id } });
  }
}
