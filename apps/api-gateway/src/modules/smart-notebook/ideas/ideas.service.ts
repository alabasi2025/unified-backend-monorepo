import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateIdeaDto, UpdateIdeaDto, FilterIdeasDto } from './dto/ideas.dto';
import { IdeaStatus, Priority } from '@prisma/client';

@Injectable()
export class IdeasService {
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء فكرة جديدة
   */
  async create(createIdeaDto: CreateIdeaDto, userId: string) {
    return this.prisma.idea.create({
      data: {
        ...createIdeaDto,
        createdBy: userId,
      },
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * الحصول على جميع الأفكار مع التصفية
   */
  async findAll(filter: FilterIdeasDto) {
    const {
      status,
      priority,
      category,
      relatedSystem,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filter;

    const where: any = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (relatedSystem) where.relatedSystem = relatedSystem;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [ideas, total] = await Promise.all([
      this.prisma.idea.findMany({
        where,
        include: {
          page: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          convertedToTask: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.idea.count({ where }),
    ]);

    return {
      ideas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * الحصول على فكرة واحدة
   */
  async findOne(id: string) {
    const idea = await this.prisma.idea.findUnique({
      where: { id },
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
          },
        },
        convertedToTask: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
          },
        },
      },
    });

    if (!idea) {
      throw new NotFoundException(`Idea with ID ${id} not found`);
    }

    return idea;
  }

  /**
   * تحديث فكرة
   */
  async update(id: string, updateIdeaDto: UpdateIdeaDto, userId: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.idea.update({
      where: { id },
      data: {
        ...updateIdeaDto,
        updatedBy: userId,
      },
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        convertedToTask: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });
  }

  /**
   * حذف فكرة
   */
  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.idea.delete({
      where: { id },
    });
  }

  /**
   * تحويل فكرة إلى مهمة
   */
  async convertToTask(id: string, userId: string) {
    const idea = await this.findOne(id);

    if (idea.status === IdeaStatus.CONVERTED) {
      throw new Error('This idea has already been converted to a task');
    }

    // Create task
    const task = await this.prisma.task.create({
      data: {
        title: idea.title,
        description: idea.description || '',
        priority: idea.priority,
        sourceType: 'IDEA',
        sourceId: idea.id,
        pageId: idea.pageId,
        tags: idea.tags,
        createdBy: userId,
      },
    });

    // Update idea status
    await this.prisma.idea.update({
      where: { id },
      data: {
        status: IdeaStatus.CONVERTED,
        convertedToTaskId: task.id,
        convertedAt: new Date(),
        updatedBy: userId,
      },
    });

    return {
      idea: await this.findOne(id),
      task,
    };
  }

  /**
   * تغيير حالة الفكرة
   */
  async changeStatus(id: string, status: IdeaStatus, userId: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.idea.update({
      where: { id },
      data: {
        status,
        updatedBy: userId,
      },
    });
  }

  /**
   * الحصول على إحصائيات الأفكار
   */
  async getStatistics() {
    const [
      total,
      newIdeas,
      underReview,
      accepted,
      rejected,
      converted,
      byPriority,
      byCategory,
    ] = await Promise.all([
      this.prisma.idea.count(),
      this.prisma.idea.count({ where: { status: IdeaStatus.NEW } }),
      this.prisma.idea.count({ where: { status: IdeaStatus.UNDER_REVIEW } }),
      this.prisma.idea.count({ where: { status: IdeaStatus.ACCEPTED } }),
      this.prisma.idea.count({ where: { status: IdeaStatus.REJECTED } }),
      this.prisma.idea.count({ where: { status: IdeaStatus.CONVERTED } }),
      this.prisma.idea.groupBy({
        by: ['priority'],
        _count: true,
      }),
      this.prisma.idea.groupBy({
        by: ['category'],
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: {
        new: newIdeas,
        underReview,
        accepted,
        rejected,
        converted,
      },
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.priority] = item._count;
        return acc;
      }, {}),
      byCategory: byCategory.reduce((acc, item) => {
        acc[item.category] = item._count;
        return acc;
      }, {}),
    };
  }
}
