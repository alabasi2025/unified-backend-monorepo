import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotebookPageDto, UpdateNotebookPageDto } from './dto/notebook-page.dto';

@Injectable()
export class NotebookPagesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateNotebookPageDto) {
    return this.prisma.notebookPage.create({
      data: {
        title: createDto.title,
        content: createDto.content || '',
        section: createDto.section,
        tags: createDto.tags || [],
        color: createDto.color,
        icon: createDto.icon,
        conversationId: createDto.conversationId,
        ideaId: createDto.ideaId,
        taskId: createDto.taskId,
        createdBy: createDto.createdBy,
      },
    });
  }

  async findAll(filters?: {
    section?: string;
    isPinned?: boolean;
    isArchived?: boolean;
    isFavorite?: boolean;
    createdBy?: string;
    search?: string;
  }) {
    const where: any = {};
    
    if (filters?.section) where.section = filters.section;
    if (filters?.isPinned !== undefined) where.isPinned = filters.isPinned;
    if (filters?.isArchived !== undefined) where.isArchived = filters.isArchived;
    if (filters?.isFavorite !== undefined) where.isFavorite = filters.isFavorite;
    if (filters?.createdBy) where.createdBy = filters.createdBy;
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.notebookPage.findMany({
      where,
      include: {
        stickyNotes: true,
        timelineEvents: {
          orderBy: { eventDate: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    const page = await this.prisma.notebookPage.findUnique({
      where: { id },
      include: {
        stickyNotes: {
          where: { isDismissed: false },
        },
        timelineEvents: {
          orderBy: { eventDate: 'desc' },
        },
      },
    });

      throw new NotFoundException(`Notebook page with ID ${id} not found`);
    }

    // Update last viewed time
    await this.prisma.notebookPage.update({
      where: { id },
      data: { lastViewedAt: new Date() },
    });

    return page;
  }

  async update(id: string, updateDto: UpdateNotebookPageDto) {
    const page = await this.prisma.notebookPage.findUnique({
      where: { id },
    });

      throw new NotFoundException(`Notebook page with ID ${id} not found`);
    }

    const updateData: any = {};
    
    if (updateDto.title !== undefined) updateData.title = updateDto.title;
    if (updateDto.content !== undefined) updateData.content = updateDto.content;
    if (updateDto.section !== undefined) updateData.section = updateDto.section;
    if (updateDto.tags !== undefined) updateData.tags = updateDto.tags;
    if (updateDto.color !== undefined) updateData.color = updateDto.color;
    if (updateDto.icon !== undefined) updateData.icon = updateDto.icon;
    if (updateDto.isPinned !== undefined) updateData.isPinned = updateDto.isPinned;
    if (updateDto.isArchived !== undefined) updateData.isArchived = updateDto.isArchived;
    if (updateDto.isFavorite !== undefined) updateData.isFavorite = updateDto.isFavorite;
    if (updateDto.updatedBy !== undefined) updateData.updatedBy = updateDto.updatedBy;

    return this.prisma.notebookPage.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const page = await this.prisma.notebookPage.findUnique({
      where: { id },
    });

      throw new NotFoundException(`Notebook page with ID ${id} not found`);
    }

    return this.prisma.notebookPage.delete({
      where: { id },
    });
  }

  async getSections(createdBy?: string) {
    const where = createdBy ? { createdBy } : {};
    
    const pages = await this.prisma.notebookPage.findMany({
      where,
      select: { section: true },
      distinct: ['section'],
    });

    return pages
      .map(p => p.section)
      .filter(s => s !== null)
      .sort();
  }

  async getStatistics(createdBy?: string) {
    const where = createdBy ? { createdBy } : {};

    const [total, pinned, archived, favorites] = await Promise.all([
      this.prisma.notebookPage.count({ where }),
      this.prisma.notebookPage.count({ where: { ...where, isPinned: true } }),
      this.prisma.notebookPage.count({ where: { ...where, isArchived: true } }),
      this.prisma.notebookPage.count({ where: { ...where, isFavorite: true } }),
    ]);

    return {
      total,
      pinned,
      archived,
      favorites,
      active: total - archived,
    };
  }
}
