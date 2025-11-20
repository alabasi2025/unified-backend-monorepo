import { Injectable } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';

@Injectable()
export class DeveloperSystemService {
  constructor(private prisma: PrismaService) {}

  // ========================================
  // 1. إدارة المحادثات (Conversations)
  // ========================================

  /**
   * إنشاء محادثة جديدة
   */
  async createConversation(userId: string, title: string) {
    return this.prisma.conversation.create({
      data: {
        userId,
        title,
        status: 'ACTIVE',
      },
    });
  }

  /**
   * الحصول على جميع محادثات المستخدم
   */
  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { messages: true, tasks: true },
        },
      },
    });
  }

  /**
   * الحصول على محادثة محددة مع جميع الرسائل
   */
  async getConversation(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * حذف محادثة
   */
  async deleteConversation(id: string) {
    return this.prisma.conversation.delete({
      where: { id },
    });
  }

  // ========================================
  // 2. إدارة الرسائل (Messages)
  // ========================================

  /**
   * إضافة رسالة إلى المحادثة
   */
  async addMessage(
    conversationId: string,
    role: 'USER' | 'ASSISTANT' | 'SYSTEM',
    content: string,
    metadata?: any,
  ) {
    return this.prisma.message.create({
      data: {
        conversationId,
        role,
        content,
        metadata,
      },
    });
  }

  /**
   * الحصول على رسائل المحادثة
   */
  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ========================================
  // 3. إدارة مهام التطوير (Development Tasks)
  // ========================================

  /**
   * إنشاء مهمة تطوير جديدة
   */
  async createTask(data: {
    conversationId?: string;
    title: string;
    description: string;
    type: string;
    priority?: string;
    estimatedHours?: number;
    complexity?: string;
    suggestedCode?: string;
    filePath?: string;
    createdBy: string;
  }) {
    return this.prisma.developmentTask.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  }

  /**
   * الحصول على جميع المهام
   */
  async getAllTasks(filters?: {
    status?: string;
    priority?: string;
    type?: string;
  }) {
    return this.prisma.developmentTask.findMany({
      where: filters,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        conversation: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * الحصول على مهمة محددة
   */
  async getTask(id: string) {
    return this.prisma.developmentTask.findUnique({
      where: { id },
      include: {
        conversation: true,
      },
    });
  }

  /**
   * تحديث حالة المهمة
   */
  async updateTaskStatus(
    id: string,
    status: string,
    data?: {
      assignedTo?: string;
      startedAt?: Date;
      completedAt?: Date;
    },
  ) {
    return this.prisma.developmentTask.update({
      where: { id },
      data: {
        status,
        ...data,
      },
    });
  }

  /**
   * حذف مهمة
   */
  async deleteTask(id: string) {
    return this.prisma.developmentTask.delete({
      where: { id },
    });
  }

  // ========================================
  // 4. قاعدة المعرفة (Knowledge Base)
  // ========================================

  /**
   * إضافة معرفة جديدة
   */
  async addKnowledge(data: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    source?: string;
    language?: string;
    createdBy: string;
  }) {
    return this.prisma.knowledgeBase.create({
      data,
    });
  }

  /**
   * البحث في قاعدة المعرفة
   */
  async searchKnowledge(query: string, category?: string) {
    const where: any = {
      isActive: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    };

    if (category) {
      where.category = category;
    }

    const results = await this.prisma.knowledgeBase.findMany({
      where,
      take: 5,
      orderBy: { usageCount: 'desc' },
    });

    // تحديث عداد الاستخدام
    if (results.length > 0) {
      await Promise.all(
        results.map((r) =>
          this.prisma.knowledgeBase.update({
            where: { id: r.id },
            data: {
              usageCount: { increment: 1 },
              lastUsedAt: new Date(),
            },
          }),
        ),
      );
    }

    return results;
  }

  /**
   * الحصول على جميع المعارف حسب الفئة
   */
  async getKnowledgeByCategory(category: string) {
    return this.prisma.knowledgeBase.findMany({
      where: { category, isActive: true },
      orderBy: { usageCount: 'desc' },
    });
  }

  // ========================================
  // 5. التحليلات (Analytics)
  // ========================================

  /**
   * تسجيل حدث تحليلي
   */
  async logAnalytics(data: {
    userId: string;
    conversationId?: string;
    eventType: string;
    eventData: any;
    processingTime?: number;
    tokensUsed?: number;
  }) {
    return this.prisma.analyticsLog.create({
      data,
    });
  }

  /**
   * الحصول على إحصائيات الاستخدام
   */
  async getUsageStats(userId?: string) {
    const where = userId ? { userId } : {};

    const [
      totalConversations,
      totalMessages,
      totalTasks,
      tasksByStatus,
      eventsByType,
    ] = await Promise.all([
      this.prisma.conversation.count({ where: userId ? { userId } : {} }),
      this.prisma.message.count(),
      this.prisma.developmentTask.count(),
      this.prisma.developmentTask.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.analyticsLog.groupBy({
        by: ['eventType'],
        _count: true,
        where,
      }),
    ]);

    return {
      totalConversations,
      totalMessages,
      totalTasks,
      tasksByStatus,
      eventsByType,
    };
  }

  // ========================================
  // 6. الإعدادات (Settings)
  // ========================================

  /**
   * الحصول على إعدادات النظام
   */
  async getSettings() {
    let settings = await this.prisma.developerSystemSettings.findFirst();

    if (!settings) {
      // إنشاء إعدادات افتراضية
      settings = await this.prisma.developerSystemSettings.create({
        data: {
          aiModel: 'gpt-4.1-mini',
          maxTokens: 4000,
          temperature: 0.7,
          autoGenerateCode: true,
          autoCreateTasks: true,
          searchEnabled: true,
          maxSearchResults: 5,
          updatedBy: 'system',
        },
      });
    }

    return settings;
  }

  /**
   * تحديث الإعدادات
   */
  async updateSettings(id: string, data: any, updatedBy: string) {
    return this.prisma.developerSystemSettings.update({
      where: { id },
      data: {
        ...data,
        updatedBy,
      },
    });
  }
}
