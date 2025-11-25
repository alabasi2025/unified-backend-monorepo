import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateChatLogDto,
  UpdateChatLogDto,
  FilterChatLogsDto,
} from './dto/chat-logs.dto';
import { ChatTopic } from '@prisma/client';

@Injectable()
export class ChatLogsService {
  constructor(private prisma: PrismaService) {}

  /**
   * حفظ محادثة جديدة
   */
  async create(createChatLogDto: CreateChatLogDto, userId: string) {
    return this.prisma.chatLog.create({
      data: {
        ...createChatLogDto,
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
        relatedTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });
  }

  /**
   * الحصول على جميع المحادثات مع التصفية
   */
  async findAll(filter: FilterChatLogsDto) {
    const {
      topic,
      isFavorite,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filter;

    const where: any = {};

    if (topic) where.topic = topic;
    if (isFavorite !== undefined) where.isFavorite = isFavorite;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [chatLogs, total] = await Promise.all([
      this.prisma.chatLog.findMany({
        where,
        include: {
          page: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          relatedTasks: {
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.chatLog.count({ where }),
    ]);

    return {
      chatLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * الحصول على محادثة واحدة
   */
  async findOne(id: string) {
    const chatLog = await this.prisma.chatLog.findUnique({
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
        relatedTasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
          },
        },
      },
    });

    if (!chatLog) {
      throw new NotFoundException(`Chat log with ID ${id} not found`);
    }

    return chatLog;
  }

  /**
   * تحديث محادثة
   */
  async update(id: string, updateChatLogDto: UpdateChatLogDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.chatLog.update({
      where: { id },
      data: updateChatLogDto,
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        relatedTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });
  }

  /**
   * حذف محادثة
   */
  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.chatLog.delete({
      where: { id },
    });
  }

  /**
   * إضافة/إزالة نجمة (مفضلة)
   */
  async toggleFavorite(id: string) {
    const chatLog = await this.findOne(id);

    return this.prisma.chatLog.update({
      where: { id },
      data: {
        isFavorite: !chatLog.isFavorite,
      },
    });
  }

  /**
   * ربط محادثة بمهمة
   */
  async linkToTask(id: string, taskId: string) {
    await this.findOne(id); // Check if chat exists

    // Check if task exists
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Link chat to task
    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        chatLogId: id,
      },
    });

    return this.findOne(id);
  }

  /**
   * إنشاء مهمة من محادثة
   */
  async createTaskFromChat(
    id: string,
    taskData: { title: string; description?: string; priority?: string },
    userId: string,
  ) {
    const chatLog = await this.findOne(id);

    const task = await this.prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description || chatLog.summary || '',
        priority: (taskData.priority as any) || 'MEDIUM',
        chatLogId: chatLog.id,
        pageId: chatLog.pageId,
        tags: chatLog.tags,
        createdBy: userId,
      },
    });

    return {
      chatLog: await this.findOne(id),
      task,
    };
  }

  /**
   * الحصول على إحصائيات المحادثات
   */
  async getStatistics() {
    const [
      total,
      favorites,
      byTopic,
      recentChats,
      totalMessages,
    ] = await Promise.all([
      this.prisma.chatLog.count(),
      this.prisma.chatLog.count({ where: { isFavorite: true } }),
      this.prisma.chatLog.groupBy({
        by: ['topic'],
        _count: true,
      }),
      this.prisma.chatLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          topic: true,
          messageCount: true,
          createdAt: true,
        },
      }),
      this.prisma.chatLog.aggregate({
        _sum: {
          messageCount: true,
        },
      }),
    ]);

    return {
      total,
      favorites,
      totalMessages: totalMessages._sum.messageCount || 0,
      byTopic: byTopic.reduce((acc, item) => {
        acc[item.topic] = item._count;
        return acc;
      }, {}),
      recentChats,
    };
  }

  /**
   * البحث في المحادثات
   */
  async search(query: string, limit = 10) {
    return this.prisma.chatLog.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        summary: true,
        topic: true,
        messageCount: true,
        isFavorite: true,
        createdAt: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
