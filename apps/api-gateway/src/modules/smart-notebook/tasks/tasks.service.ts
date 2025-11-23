import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, FilterTasksDto } from './dto/tasks.dto';
import { TaskStatus, Priority } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        createdBy: userId,
      },
      include: {
        page: { select: { id: true, title: true, slug: true } },
        chatLog: { select: { id: true, title: true } },
        fromIdea: { select: { id: true, title: true } },
        parentTask: { select: { id: true, title: true } },
      },
    });

    // Create timeline event
    await this.prisma.timelineEvent.create({
      data: {
        eventType: 'TASK_CREATED',
        title: `مهمة جديدة: ${task.title}`,
        taskId: task.id,
        ideaId: task.sourceType === 'IDEA' ? task.sourceId : null,
        conversationId: task.conversationId,
        createdBy: userId,
      },
    });

    return task;
  }

  async findAll(filter: FilterTasksDto) {
    const { status, priority, assignedTo, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = filter;
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          page: { select: { id: true, title: true, slug: true } },
          chatLog: { select: { id: true, title: true } },
          fromIdea: { select: { id: true, title: true } },
          parentTask: { select: { id: true, title: true } },
          subTasks: { select: { id: true, title: true, status: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return { tasks, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        page: true,
        chatLog: true,
        fromIdea: true,
        parentTask: true,
        subTasks: true,
      },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: { ...updateTaskDto, updatedBy: userId },
      include: {
        page: { select: { id: true, title: true } },
        chatLog: { select: { id: true, title: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.task.delete({ where: { id } });
  }

  async changeStatus(id: string, status: TaskStatus, userId: string) {
    const task = await this.findOne(id);
    const data: any = { status, updatedBy: userId };
    if (status === TaskStatus.DONE) data.completedAt = new Date();
    
    const updatedTask = await this.prisma.task.update({ where: { id }, data });

    // Create timeline event
    const eventTypeMap = {
      [TaskStatus.IN_PROGRESS]: 'TASK_STARTED',
      [TaskStatus.DONE]: 'TASK_COMPLETED',
      [TaskStatus.BLOCKED]: 'TASK_BLOCKED',
    };

    if (eventTypeMap[status]) {
      await this.prisma.timelineEvent.create({
        data: {
          eventType: eventTypeMap[status],
          title: `تغيير حالة المهمة: ${task.title}`,
          taskId: task.id,
          ideaId: task.sourceType === 'IDEA' ? task.sourceId : null,
          conversationId: task.conversationId,
          metadata: { oldStatus: task.status, newStatus: status },
          createdBy: userId,
        },
      });
    }

    return updatedTask;
  }

  async getStatistics() {
    const [total, byStatus, byPriority, overdue, completed] = await Promise.all([
      this.prisma.task.count(),
      this.prisma.task.groupBy({ by: ['status'], _count: true }),
      this.prisma.task.groupBy({ by: ['priority'], _count: true }),
      this.prisma.task.count({ where: { dueDate: { lt: new Date() }, status: { not: TaskStatus.DONE } } }),
      this.prisma.task.count({ where: { status: TaskStatus.DONE } }),
    ]);

    return {
      total,
      completed,
      overdue,
      byStatus: byStatus.reduce((acc, i) => ({ ...acc, [i.status]: i._count }), {}),
      byPriority: byPriority.reduce((acc, i) => ({ ...acc, [i.priority]: i._count }), {}),
    };
  }
}
