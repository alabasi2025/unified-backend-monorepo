import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTimelineEventDto, TimelineEventType } from './dto/timeline-event.dto';

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateTimelineEventDto) {
    return this.prisma.timelineEvent.create({
      data: createDto as any,
    });
  }

  async findAll(filters?: {
    eventType?: TimelineEventType;
    conversationId?: string;
    ideaId?: string;
    taskId?: string;
    pageId?: string;
    createdBy?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.eventType) where.eventType = filters.eventType;
    if (filters?.conversationId) where.conversationId = filters.conversationId;
    if (filters?.ideaId) where.ideaId = filters.ideaId;
    if (filters?.taskId) where.taskId = filters.taskId;
    if (filters?.pageId) where.pageId = filters.pageId;
    if (filters?.createdBy) where.createdBy = filters.createdBy;

    if (filters?.startDate || filters?.endDate) {
      where.eventDate = {};
      if (filters.startDate) where.eventDate.gte = filters.startDate;
      if (filters.endDate) where.eventDate.lte = filters.endDate;
    }

    return this.prisma.timelineEvent.findMany({
      where,
      include: {
        page: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { eventDate: 'desc' },
    });
  }

  async findByEntity(entityType: string, entityId: string) {
    const where: any = {};

    switch (entityType) {
      case 'conversation':
        where.conversationId = entityId;
        break;
      case 'idea':
        where.ideaId = entityId;
        break;
      case 'task':
        where.taskId = entityId;
        break;
      case 'page':
        where.pageId = entityId;
        break;
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }

    return this.prisma.timelineEvent.findMany({
      where,
      orderBy: { eventDate: 'asc' },
    });
  }

  async getStatistics(filters?: {
    createdBy?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.createdBy) where.createdBy = filters.createdBy;
    if (filters?.startDate || filters?.endDate) {
      where.eventDate = {};
      if (filters.startDate) where.eventDate.gte = filters.startDate;
      if (filters.endDate) where.eventDate.lte = filters.endDate;
    }

    const [total, byType] = await Promise.all([
      this.prisma.timelineEvent.count({ where }),
      this.prisma.timelineEvent.groupBy({
        by: ['eventType'],
        where,
        _count: true,
      }),
    ]);

    const statistics: any = { total, byType: {} };

    byType.forEach(item => {
      statistics.byType[item.eventType] = item._count;
    });

    return statistics;
  }

  // Helper methods to create specific event types
  async createConversationEvent(
    conversationId: string,
    type: 'CREATED' | 'UPDATED' | 'ARCHIVED',
    title: string,
    createdBy: string,
  ) {
    const eventTypeMap = {
      CREATED: TimelineEventType.CONVERSATION_CREATED,
      UPDATED: TimelineEventType.CONVERSATION_UPDATED,
      ARCHIVED: TimelineEventType.CONVERSATION_ARCHIVED,
    };

    return this.create({
      eventType: eventTypeMap[type],
      title,
      conversationId,
      createdBy,
    });
  }

  async createIdeaEvent(
    ideaId: string,
    type: 'EXTRACTED' | 'APPROVED' | 'REJECTED',
    title: string,
    createdBy: string,
    conversationId?: string,
  ) {
    const eventTypeMap = {
      EXTRACTED: TimelineEventType.IDEA_EXTRACTED,
      APPROVED: TimelineEventType.IDEA_APPROVED,
      REJECTED: TimelineEventType.IDEA_REJECTED,
    };

    return this.create({
      eventType: eventTypeMap[type],
      title,
      ideaId,
      conversationId,
      createdBy,
    });
  }

  async createTaskEvent(
    taskId: string,
    type: 'CREATED' | 'STARTED' | 'PROGRESS' | 'BLOCKED' | 'COMPLETED',
    title: string,
    createdBy: string,
    ideaId?: string,
    metadata?: any,
  ) {
    const eventTypeMap = {
      CREATED: TimelineEventType.TASK_CREATED,
      STARTED: TimelineEventType.TASK_STARTED,
      PROGRESS: TimelineEventType.TASK_PROGRESS,
      BLOCKED: TimelineEventType.TASK_BLOCKED,
      COMPLETED: TimelineEventType.TASK_COMPLETED,
    };

    return this.create({
      eventType: eventTypeMap[type],
      title,
      taskId,
      ideaId,
      metadata,
      createdBy,
    });
  }
}
