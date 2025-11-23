import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAchievementReportDto, AchievementReportType } from './dto/create-achievement-report.dto';

@Injectable()
export class AchievementReportsService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateAchievementReportDto) {
    const { taskIds, ...reportData } = createReportDto;

    const report = await this.prisma.achievementReport.create({
      data: {
        ...reportData,
        startDate: new Date(reportData.startDate),
        endDate: new Date(reportData.endDate),
      },
    });

    // Link tasks if provided
    if (taskIds && taskIds.length > 0) {
      await Promise.all(
        taskIds.map((taskId) =>
          this.prisma.taskAchievement.create({
            data: {
              taskId,
              reportId: report.id,
            },
          }),
        ),
      );
    }

    return this.findOne(report.id);
  }

  async findAll(filters?: {
    type?: AchievementReportType;
    team?: string;
    project?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.team) {
      where.team = filters.team;
    }

    if (filters?.project) {
      where.project = filters.project;
    }

    if (filters?.startDate) {
      where.startDate = { gte: new Date(filters.startDate) };
    }

    if (filters?.endDate) {
      where.endDate = { lte: new Date(filters.endDate) };
    }

    return this.prisma.achievementReport.findMany({
      where,
      include: {
        tasks: {
          include: {
            task: {
              select: {
                id: true,
                title: true,
                status: true,
                progress: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.achievementReport.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            task: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException(`Achievement Report with ID ${id} not found`);
    }

    return report;
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.achievementReport.delete({
      where: { id },
    });
  }

  async generateAutoReport(params: {
    type: AchievementReportType;
    startDate: Date;
    endDate: Date;
    team?: string;
    project?: string;
    createdBy: string;
  }) {
    const { type, startDate, endDate, team, project, createdBy } = params;

    // Fetch statistics
    const [
      totalTasks,
      completedTasks,
      totalIdeas,
      convertedIdeas,
      totalConversations,
      processedConversations,
    ] = await Promise.all([
      this.prisma.task.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...(team && { team }),
        },
      }),
      this.prisma.task.count({
        where: {
          status: 'COMPLETED',
          completedDate: { gte: startDate, lte: endDate },
          ...(team && { team }),
        },
      }),
      this.prisma.idea.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.idea.count({
        where: {
          status: 'CONVERTED',
          convertedAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.conversation.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.conversation.count({
        where: {
          status: { in: ['COMPLETED', 'ARCHIVED'] },
          completedAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    const progressPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Fetch completed tasks for linking
    const completedTasksList = await this.prisma.task.findMany({
      where: {
        status: 'COMPLETED',
        completedDate: { gte: startDate, lte: endDate },
        ...(team && { team }),
      },
      select: { id: true, title: true },
    });

    // Generate content
    const content = this.generateReportContent({
      type,
      startDate,
      endDate,
      totalTasks,
      completedTasks,
      progressPercentage,
      totalIdeas,
      convertedIdeas,
      totalConversations,
      processedConversations,
      completedTasksList,
    });

    // Create report
    return this.create({
      title: `تقرير إنجاز ${this.getTypeName(type)} - ${startDate.toLocaleDateString('ar-EG')}`,
      type,
      period: this.getPeriodString(type, startDate, endDate),
      totalTasks,
      completedTasks,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      totalIdeas,
      convertedIdeas,
      totalConversations,
      processedConversations,
      content,
      summary: this.generateSummary(completedTasks, totalTasks, progressPercentage),
      team,
      project,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdBy,
      taskIds: completedTasksList.map((t) => t.id),
    });
  }

  private getTypeName(type: AchievementReportType): string {
    const names = {
      DAILY: 'يومي',
      WEEKLY: 'أسبوعي',
      MONTHLY: 'شهري',
      QUARTERLY: 'ربع سنوي',
      YEARLY: 'سنوي',
      PROJECT: 'مشروع',
      TEAM: 'فريق',
      CUSTOM: 'مخصص',
    };
    return names[type] || 'مخصص';
  }

  private getPeriodString(
    type: AchievementReportType,
    startDate: Date,
    endDate: Date,
  ): string {
    const start = startDate.toLocaleDateString('ar-EG');
    const end = endDate.toLocaleDateString('ar-EG');
    return `${start} - ${end}`;
  }

  private generateSummary(
    completed: number,
    total: number,
    percentage: number,
  ): string {
    return `تم إنجاز ${completed} مهمة من أصل ${total} مهمة بنسبة ${percentage.toFixed(1)}%`;
  }

  private generateReportContent(data: any): string {
    return `
# تقرير الإنجاز ${this.getTypeName(data.type)}

**الفترة**: ${data.startDate.toLocaleDateString('ar-EG')} - ${data.endDate.toLocaleDateString('ar-EG')}

## 📊 الإحصائيات العامة

### المهام
- **إجمالي المهام**: ${data.totalTasks}
- **المهام المنجزة**: ${data.completedTasks}
- **نسبة الإنجاز**: ${data.progressPercentage.toFixed(1)}%

### الأفكار
- **إجمالي الأفكار**: ${data.totalIdeas}
- **الأفكار المحولة لمهام**: ${data.convertedIdeas}

### المحادثات
- **إجمالي المحادثات**: ${data.totalConversations}
- **المحادثات المعالجة**: ${data.processedConversations}

## ✅ المهام المنجزة

${data.completedTasksList.map((task: any, index: number) => `${index + 1}. ${task.title}`).join('\n')}

---

**تاريخ إنشاء التقرير**: ${new Date().toLocaleString('ar-EG')}
    `.trim();
  }
}
