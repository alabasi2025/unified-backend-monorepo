import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStickyNoteDto, UpdateStickyNoteDto } from './dto/sticky-note.dto';

@Injectable()
export class StickyNotesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateStickyNoteDto) {
    return this.prisma.stickyNote.create({
      data: createDto,
    });
  }

  async findAll(filters?: {
    pageId?: string;
    conversationId?: string;
    ideaId?: string;
    taskId?: string;
    isDismissed?: boolean;
    createdBy?: string;
  }) {
    const where: any = {};

    if (filters?.pageId) where.pageId = filters.pageId;
    if (filters?.conversationId) where.conversationId = filters.conversationId;
    if (filters?.ideaId) where.ideaId = filters.ideaId;
    if (filters?.taskId) where.taskId = filters.taskId;
    if (filters?.isDismissed !== undefined) where.isDismissed = filters.isDismissed;
    if (filters?.createdBy) where.createdBy = filters.createdBy;

    return this.prisma.stickyNote.findMany({
      where,
      include: {
        page: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.stickyNote.findUnique({
      where: { id },
      include: {
        page: true,
      },
    });

    if (!note) {
      throw new NotFoundException(`Sticky note with ID ${id} not found`);
    }

    return note;
  }

  async update(id: string, updateDto: UpdateStickyNoteDto) {
    const note = await this.prisma.stickyNote.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException(`Sticky note with ID ${id} not found`);
    }

    return this.prisma.stickyNote.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    const note = await this.prisma.stickyNote.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException(`Sticky note with ID ${id} not found`);
    }

    return this.prisma.stickyNote.delete({
      where: { id },
    });
  }

  async dismiss(id: string) {
    return this.update(id, { isDismissed: true });
  }

  async restore(id: string) {
    return this.update(id, { isDismissed: false });
  }
}
