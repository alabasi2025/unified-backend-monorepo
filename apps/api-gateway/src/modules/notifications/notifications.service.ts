import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface Notification {
  id: string;
  type: 'idea' | 'conversation' | 'report' | 'task';
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(): Promise<Notification[]> {
    const notifications: Notification[] = [];

    // Check for new ideas (last 7 days)
    try {
      const newIdeas = await this.prisma.idea.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          status: 'NEW',
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      newIdeas.forEach((idea: any) => {
        notifications.push({
          id: `idea-${idea.id}`,
          type: 'idea',
          title: '💡 فكرة جديدة تحتاج مراجعة',
          message: idea.title,
          link: `/smart-notebook/ideas?id=${idea.id}`,
          isRead: false,
          createdAt: idea.createdAt,
        });
      });
    } catch (error) {
      // Table doesn't exist
    }

    // Check for important conversations
    try {
      const importantChats = await this.prisma.conversation.findMany({
        where: {
          isFavorite: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      importantChats.forEach((chat: any) => {
        notifications.push({
          id: `chat-${chat.id}`,
          type: 'conversation',
          title: '💬 محادثة مهمة',
          message: chat.title,
          link: `/smart-notebook/chats?id=${chat.id}`,
          isRead: false,
          createdAt: chat.createdAt,
        });
      });
    } catch (error) {
      // Table doesn't exist
    }

    // Check for new reports
    const newReports = await this.prisma.report.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        status: 'PUBLISHED',
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    newReports.forEach((report) => {
      notifications.push({
        id: `report-${report.id}`,
        type: 'report',
        title: '📊 تقرير جديد',
        message: report.title,
        link: `/smart-notebook/reports?id=${report.id}`,
        isRead: false,
        createdAt: report.createdAt,
      });
    });

    // Check for upcoming tasks
    try {
      const upcomingTasks = await this.prisma.task.findMany({
        where: {
          dueDate: {
            lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Next 3 days
            gte: new Date(),
          },
          status: {
            in: ['PENDING', 'IN_PROGRESS'],
          },
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
      });

      upcomingTasks.forEach((task: any) => {
        notifications.push({
          id: `task-${task.id}`,
          type: 'task',
          title: '✅ مهمة قاربت موعدها',
          message: task.title,
          link: `/smart-notebook/tasks?id=${task.id}`,
          isRead: false,
          createdAt: task.createdAt,
        });
      });
    } catch (error) {
      // Table doesn't exist
    }

    // Sort by date
    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return notifications.slice(0, 20);
  }

  async markAsRead(id: string) {
    // In a real implementation, you would store read status in database
    return { success: true };
  }

  async markAllAsRead() {
    // In a real implementation, you would update all notifications
    return { success: true };
  }
}
