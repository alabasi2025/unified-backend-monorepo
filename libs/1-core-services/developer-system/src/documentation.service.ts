import { Injectable } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';

@Injectable()
export class DocumentationService {
  constructor(private prisma: PrismaService) {}

  // ========================================
  // 1. إدارة الوثائق (Documents)
  // ========================================

  /**
   * إنشاء وثيقة جديدة
   */
  async createDocument(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    category: string;
    type: string;
    module?: string;
    order?: number;
    icon?: string;
    coverImage?: string;
    tags?: string[];
    keywords?: string[];
    version?: string;
    createdBy: string;
  }) {
    return this.prisma.documentation.create({
      data: {
        ...data,
        status: 'DRAFT',
        isPublished: false,
      },
    });
  }

  /**
   * الحصول على جميع الوثائق
   */
  async getAllDocuments(filters?: {
    category?: string;
    type?: string;
    module?: string;
    status?: string;
    isPublished?: boolean;
  }) {
    return this.prisma.documentation.findMany({
      where: filters,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        sections: {
          where: { parentId: null },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            sections: true,
            attachments: true,
            changelog: true,
          },
        },
      },
    });
  }

  /**
   * الحصول على وثيقة محددة
   */
  async getDocument(id: string) {
    const doc = await this.prisma.documentation.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' },
            },
          },
        },
        attachments: true,
        changelog: {
          orderBy: { releaseDate: 'desc' },
          take: 5,
        },
      },
    });

    // زيادة عداد المشاهدات
    if (doc) {
      await this.prisma.documentation.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      // تسجيل المشاهدة
      await this.logAnalytics(id, 'VIEW');
    }

    return doc;
  }

  /**
   * الحصول على وثيقة بالـ slug
   */
  async getDocumentBySlug(slug: string) {
    return this.prisma.documentation.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { parentId: null },
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' },
            },
          },
        },
        attachments: true,
        changelog: {
          orderBy: { releaseDate: 'desc' },
          take: 5,
        },
      },
    });
  }

  /**
   * تحديث وثيقة
   */
  async updateDocument(id: string, data: any, updatedBy: string) {
    return this.prisma.documentation.update({
      where: { id },
      data: {
        ...data,
        updatedBy,
      },
    });
  }

  /**
   * نشر وثيقة
   */
  async publishDocument(id: string) {
    return this.prisma.documentation.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  /**
   * حذف وثيقة
   */
  async deleteDocument(id: string) {
    return this.prisma.documentation.delete({
      where: { id },
    });
  }

  // ========================================
  // 2. الأقسام (Sections)
  // ========================================

  /**
   * إضافة قسم إلى وثيقة
   */
  async addSection(data: {
    documentId: string;
    title: string;
    content: string;
    order?: number;
    level?: number;
    parentId?: string;
  }) {
    return this.prisma.documentSection.create({
      data,
    });
  }

  /**
   * تحديث قسم
   */
  async updateSection(id: string, data: any) {
    return this.prisma.documentSection.update({
      where: { id },
      data,
    });
  }

  /**
   * حذف قسم
   */
  async deleteSection(id: string) {
    return this.prisma.documentSection.delete({
      where: { id },
    });
  }

  // ========================================
  // 3. سجل التحديثات (Changelog)
  // ========================================

  /**
   * إنشاء إدخال changelog
   */
  async createChangelog(data: {
    documentId?: string;
    version: string;
    releaseDate: Date;
    title: string;
    summary: string;
    breaking?: string;
    features?: string[];
    improvements?: string[];
    bugFixes?: string[];
    deprecated?: string[];
    type: string;
    importance: string;
    createdBy: string;
  }) {
    return this.prisma.changelogEntry.create({
      data: {
        ...data,
        isPublished: false,
      },
    });
  }

  /**
   * الحصول على جميع التحديثات
   */
  async getAllChangelogs(filters?: {
    type?: string;
    importance?: string;
    isPublished?: boolean;
  }) {
    return this.prisma.changelogEntry.findMany({
      where: filters,
      orderBy: { releaseDate: 'desc' },
      include: {
        document: {
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
   * الحصول على changelog محدد
   */
  async getChangelog(id: string) {
    return this.prisma.changelogEntry.findUnique({
      where: { id },
      include: {
        document: true,
      },
    });
  }

  /**
   * نشر changelog
   */
  async publishChangelog(id: string) {
    return this.prisma.changelogEntry.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  // ========================================
  // 4. تقدم المهام (Task Progress)
  // ========================================

  /**
   * إنشاء تتبع مهمة
   */
  async createTaskProgress(data: {
    module: string;
    feature: string;
    description: string;
    totalTasks?: number;
    priority?: number;
  }) {
    return this.prisma.taskProgress.create({
      data: {
        ...data,
        status: 'NOT_STARTED',
        progress: 0,
        completedTasks: 0,
      },
    });
  }

  /**
   * تحديث تقدم المهمة
   */
  async updateTaskProgress(
    id: string,
    data: {
      status?: string;
      completedTasks?: number;
      totalTasks?: number;
      startedAt?: Date;
      completedAt?: Date;
      estimatedEnd?: Date;
    },
  ) {
    // حساب النسبة المئوية
    let progress = 0;
    if (data.completedTasks && data.totalTasks) {
      progress = Math.round((data.completedTasks / data.totalTasks) * 100);
    }

    return this.prisma.taskProgress.update({
      where: { id },
      data: {
        ...data,
        progress,
      },
    });
  }

  /**
   * الحصول على تقدم جميع المهام
   */
  async getAllTaskProgress(filters?: {
    module?: string;
    status?: string;
  }) {
    return this.prisma.taskProgress.findMany({
      where: filters,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * الحصول على ملخص التقدم
   */
  async getProgressSummary() {
    const [total, completed, inProgress, notStarted] = await Promise.all([
      this.prisma.taskProgress.count(),
      this.prisma.taskProgress.count({ where: { status: 'COMPLETED' } }),
      this.prisma.taskProgress.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.taskProgress.count({ where: { status: 'NOT_STARTED' } }),
    ]);

    const byModule = await this.prisma.taskProgress.groupBy({
      by: ['module'],
      _count: true,
      _avg: { progress: true },
    });

    return {
      total,
      completed,
      inProgress,
      notStarted,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byModule,
    };
  }

  // ========================================
  // 5. البحث (Search)
  // ========================================

  /**
   * البحث في الوثائق
   */
  async searchDocuments(query: string, filters?: {
    category?: string;
    module?: string;
  }) {
    const where: any = {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
        { keywords: { has: query } },
      ],
    };

    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.module) {
      where.module = filters.module;
    }

    const results = await this.prisma.documentation.findMany({
      where,
      take: 20,
      orderBy: { viewCount: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        type: true,
        module: true,
        icon: true,
        viewCount: true,
        updatedAt: true,
      },
    });

    // تسجيل البحث
    await this.logSearch(query, results.length);

    return results;
  }

  /**
   * فهرسة وثيقة للبحث
   */
  async indexDocument(documentId: string) {
    const doc = await this.prisma.documentation.findUnique({
      where: { id: documentId },
      include: { sections: true },
    });

    if (!doc) return;

    const content = [
      doc.content,
      ...doc.sections.map((s) => s.content),
    ].join(' ');

    await this.prisma.documentationSearchIndex.upsert({
      where: { documentId },
      create: {
        documentId,
        title: doc.title,
        content,
        keywords: [...doc.tags, ...doc.keywords],
        weight: doc.viewCount > 100 ? 3 : doc.viewCount > 50 ? 2 : 1,
      },
      update: {
        title: doc.title,
        content,
        keywords: [...doc.tags, ...doc.keywords],
        weight: doc.viewCount > 100 ? 3 : doc.viewCount > 50 ? 2 : 1,
        lastIndexedAt: new Date(),
      },
    });
  }

  // ========================================
  // 6. التعليقات (Feedback)
  // ========================================

  /**
   * إضافة تعليق
   */
  async addFeedback(data: {
    documentId: string;
    userId: string;
    userName: string;
    rating?: number;
    comment?: string;
    type: string;
  }) {
    return this.prisma.documentationFeedback.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  }

  /**
   * الحصول على تعليقات وثيقة
   */
  async getDocumentFeedback(documentId: string) {
    return this.prisma.documentationFeedback.findMany({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * الرد على تعليق
   */
  async respondToFeedback(
    id: string,
    response: string,
    respondedBy: string,
  ) {
    return this.prisma.documentationFeedback.update({
      where: { id },
      data: {
        response,
        respondedBy,
        respondedAt: new Date(),
        status: 'REVIEWED',
      },
    });
  }

  // ========================================
  // 7. التحليلات (Analytics)
  // ========================================

  /**
   * تسجيل حدث تحليلي
   */
  async logAnalytics(
    documentId: string,
    eventType: string,
    userId?: string,
    metadata?: any,
  ) {
    return this.prisma.documentationAnalytics.create({
      data: {
        documentId,
        eventType,
        userId,
        metadata,
      },
    });
  }

  /**
   * تسجيل بحث
   */
  private async logSearch(query: string, resultsCount: number) {
    // يمكن تسجيل البحث في جدول منفصل أو في Analytics
    console.log(`Search: "${query}" - ${resultsCount} results`);
  }

  /**
   * الحصول على إحصائيات الوثائق
   */
  async getDocumentationStats() {
    const [
      totalDocs,
      publishedDocs,
      totalViews,
      totalLikes,
      docsByCategory,
      topDocs,
    ] = await Promise.all([
      this.prisma.documentation.count(),
      this.prisma.documentation.count({ where: { isPublished: true } }),
      this.prisma.documentation.aggregate({ _sum: { viewCount: true } }),
      this.prisma.documentation.aggregate({ _sum: { likeCount: true } }),
      this.prisma.documentation.groupBy({
        by: ['category'],
        _count: true,
      }),
      this.prisma.documentation.findMany({
        where: { isPublished: true },
        take: 10,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          viewCount: true,
          likeCount: true,
        },
      }),
    ]);

    return {
      totalDocs,
      publishedDocs,
      totalViews: totalViews._sum.viewCount || 0,
      totalLikes: totalLikes._sum.likeCount || 0,
      docsByCategory,
      topDocs,
    };
  }

  // ========================================
  // 8. التحديث التلقائي
  // ========================================

  /**
   * تحديث الوثائق تلقائياً عند إنجاز مهمة
   */
  async autoUpdateOnTaskComplete(taskId: string) {
    const task = await this.prisma.developmentTask.findUnique({
      where: { id: taskId },
    });

    if (!task || task.status !== 'COMPLETED') return;

    // 1. تحديث تقدم المهام
    const taskProgress = await this.prisma.taskProgress.findFirst({
      where: {
        module: task.type, // أو حسب التصنيف
      },
    });

    if (taskProgress) {
      await this.updateTaskProgress(taskProgress.id, {
        completedTasks: taskProgress.completedTasks + 1,
        totalTasks: taskProgress.totalTasks,
      });
    }

    // 2. إنشاء إدخال changelog تلقائياً
    const version = await this.getNextVersion();
    await this.createChangelog({
      version,
      releaseDate: new Date(),
      title: `تم إنجاز: ${task.title}`,
      summary: task.description,
      features: [task.title],
      improvements: [],
      bugFixes: task.type === 'BUG_FIX' ? [task.title] : [],
      type: 'PATCH',
      importance: task.priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
      createdBy: task.createdBy,
    });

    // 3. تحديث دليل المطور
    await this.updateDeveloperGuide(task);
  }

  /**
   * الحصول على الإصدار التالي
   */
  private async getNextVersion(): Promise<string> {
    const latest = await this.prisma.changelogEntry.findFirst({
      orderBy: { releaseDate: 'desc' },
    });

    if (!latest) return '1.0.0';

    const [major, minor, patch] = latest.version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * تحديث دليل المطور
   */
  private async updateDeveloperGuide(task: any) {
    const devGuide = await this.prisma.documentation.findFirst({
      where: {
        category: 'DEVELOPER_GUIDE',
        module: task.type,
      },
    });

    if (devGuide) {
      const newContent = `${devGuide.content}\n\n## ${task.title}\n\n${task.description}\n\n**تم الإنجاز:** ${new Date().toLocaleDateString('ar-EG')}`;

      await this.updateDocument(
        devGuide.id,
        { content: newContent },
        task.createdBy,
      );
    }
  }
}
