import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskProgressReportDto,
  UpdateTaskProgressReportDto,
  GenerateTaskProgressReportDto,
} from './dto/create-task-progress-report.dto';

@Injectable()
export class TaskProgressReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء تقرير سير مهام جديد
   */
  async create(createDto: CreateTaskProgressReportDto) {
    const { taskIds, ...reportData } = createDto;

    // Get tasks if provided
    let tasks = [];
    if (taskIds && taskIds.length > 0) {
      tasks = await this.prisma.task.findMany({
        where: { id: { in: taskIds } },
      });
    }

    // Calculate statistics
    const stats = this.calculateStatistics(tasks);

    return this.prisma.taskProgressReport.create({
      data: {
        ...reportData,
        ...stats,
        startDate: reportData.startDate ? new Date(reportData.startDate) : null,
        targetDate: reportData.targetDate ? new Date(reportData.targetDate) : null,
      },
    });
  }

  /**
   * توليد تقرير تلقائي بناءً على المهام
   */
  async generate(generateDto: GenerateTaskProgressReportDto) {
    const { system, project, taskIds, createdBy } = generateDto;

    // Build query
    const where: any = {};
    if (system) where.team = system;
    if (project) where.tags = { has: project };
    if (taskIds) where.id = { in: taskIds };

    // Get tasks
    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        idea: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (tasks.length === 0) {
      throw new NotFoundException('No tasks found matching the criteria');
    }

    // Calculate statistics
    const stats = this.calculateStatistics(tasks);

    // Generate title
    const title = system
      ? `تقرير سير المهام - ${system}`
      : project
      ? `تقرير سير المهام - ${project}`
      : 'تقرير سير المهام';

    // Generate summary
    const summary = this.generateSummary(stats, tasks);

    // Generate achievements
    const achievements = this.generateAchievements(tasks.filter((t) => t.status === 'COMPLETED'));

    // Generate challenges
    const challenges = this.generateChallenges(tasks.filter((t) => t.status === 'BLOCKED'));

    // Generate next steps
    const nextSteps = this.generateNextSteps(tasks.filter((t) => t.status === 'NEW' || t.status === 'IN_PROGRESS'));

    return this.prisma.taskProgressReport.create({
      data: {
        title,
        description: `تقرير تلقائي لتتبع تقدم ${tasks.length} مهمة`,
        system,
        project,
        ...stats,
        summary,
        achievements,
        challenges,
        nextSteps,
        createdBy,
      },
    });
  }

  /**
   * الحصول على جميع التقارير
   */
  async findAll(filters?: {
    system?: string;
    project?: string;
    minProgress?: number;
    maxProgress?: number;
  }) {
    const where: any = {};

    if (filters?.system) where.system = filters.system;
    if (filters?.project) where.project = filters.project;
    if (filters?.minProgress !== undefined) {
      where.overallProgress = { gte: filters.minProgress };
    }
    if (filters?.maxProgress !== undefined) {
      where.overallProgress = { ...where.overallProgress, lte: filters.maxProgress };
    }

    return this.prisma.taskProgressReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * الحصول على تقرير واحد
   */
  async findOne(id: string) {
    const report = await this.prisma.taskProgressReport.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Task Progress Report with ID ${id} not found`);
    }

    // Get tasks details
    const allTaskIds = [
      ...report.completedTasksList,
      ...report.inProgressTasksList,
      ...report.blockedTasksList,
      ...report.pendingTasksList,
    ];

    const tasks = await this.prisma.task.findMany({
      where: { id: { in: allTaskIds } },
      select: {
        id: true,
        title: true,
        status: true,
        progress: true,
        priority: true,
        assignee: true,
        dueDate: true,
      },
    });

    return {
      ...report,
      tasks: {
        completed: tasks.filter((t) => report.completedTasksList.includes(t.id)),
        inProgress: tasks.filter((t) => report.inProgressTasksList.includes(t.id)),
        blocked: tasks.filter((t) => report.blockedTasksList.includes(t.id)),
        pending: tasks.filter((t) => report.pendingTasksList.includes(t.id)),
      },
    };
  }

  /**
   * تحديث تقرير
   */
  async update(id: string, updateDto: UpdateTaskProgressReportDto) {
    await this.findOne(id);

    const { taskIds, ...updateData } = updateDto;

    // If taskIds provided, recalculate statistics
    let stats = {};
    if (taskIds && taskIds.length > 0) {
      const tasks = await this.prisma.task.findMany({
        where: { id: { in: taskIds } },
      });
      stats = this.calculateStatistics(tasks);
    }

    return this.prisma.taskProgressReport.update({
      where: { id },
      data: {
        ...updateData,
        ...stats,
        lastUpdated: new Date(),
      },
    });
  }

  /**
   * حذف تقرير
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.taskProgressReport.delete({ where: { id } });
  }

  /**
   * الحصول على إحصائيات
   */
  async getStatistics() {
    const [total, bySystem, byProject, avgProgress] = await Promise.all([
      this.prisma.taskProgressReport.count(),
      this.prisma.taskProgressReport.groupBy({
        by: ['system'],
        _count: true,
        where: { system: { not: null } },
      }),
      this.prisma.taskProgressReport.groupBy({
        by: ['project'],
        _count: true,
        where: { project: { not: null } },
      }),
      this.prisma.taskProgressReport.aggregate({
        _avg: { overallProgress: true },
      }),
    ]);

    return {
      total,
      averageProgress: avgProgress._avg.overallProgress || 0,
      bySystem: bySystem.reduce((acc, item) => {
        if (item.system) acc[item.system] = item._count;
        return acc;
      }, {}),
      byProject: byProject.reduce((acc, item) => {
        if (item.project) acc[item.project] = item._count;
        return acc;
      }, {}),
    };
  }

  /**
   * حساب الإحصائيات من المهام
   */
  private calculateStatistics(tasks: any[]) {
    const completed = tasks.filter((t) => t.status === 'COMPLETED');
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS');
    const blocked = tasks.filter((t) => t.status === 'BLOCKED');
    const pending = tasks.filter((t) => ['NEW', 'ON_HOLD'].includes(t.status));

    const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
    const overallProgress = tasks.length > 0 ? totalProgress / tasks.length : 0;

    return {
      totalTasks: tasks.length,
      completedTasks: completed.length,
      inProgressTasks: inProgress.length,
      blockedTasks: blocked.length,
      pendingTasks: pending.length,
      overallProgress: Math.round(overallProgress * 100) / 100,
      completedTasksList: completed.map((t) => t.id),
      inProgressTasksList: inProgress.map((t) => t.id),
      blockedTasksList: blocked.map((t) => t.id),
      pendingTasksList: pending.map((t) => t.id),
    };
  }

  /**
   * توليد ملخص
   */
  private generateSummary(stats: any, tasks: any[]): string {
    const percentage = stats.overallProgress.toFixed(1);
    return `تم إنجاز ${stats.completedTasks} مهمة من أصل ${stats.totalTasks} مهمة بنسبة ${percentage}%. يوجد ${stats.inProgressTasks} مهمة قيد التنفيذ، ${stats.blockedTasks} مهمة محظورة، و${stats.pendingTasks} مهمة معلقة.`;
  }

  /**
   * توليد قائمة الإنجازات
   */
  private generateAchievements(completedTasks: any[]): string {
    if (completedTasks.length === 0) return 'لا توجد إنجازات حتى الآن.';

    const list = completedTasks
      .slice(0, 10)
      .map((task, index) => `${index + 1}. ${task.title}`)
      .join('\n');

    return `تم إنجاز المهام التالية:\n\n${list}`;
  }

  /**
   * توليد قائمة التحديات
   */
  private generateChallenges(blockedTasks: any[]): string {
    if (blockedTasks.length === 0) return 'لا توجد معوقات حالياً.';

    const list = blockedTasks
      .map((task, index) => {
        const blocker = task.blockers || 'غير محدد';
        return `${index + 1}. ${task.title}\n   المعوق: ${blocker}`;
      })
      .join('\n\n');

    return `المهام المحظورة:\n\n${list}`;
  }

  /**
   * توليد الخطوات التالية
   */
  private generateNextSteps(activeTasks: any[]): string {
    if (activeTasks.length === 0) return 'لا توجد مهام نشطة حالياً.';

    const list = activeTasks
      .slice(0, 5)
      .map((task, index) => {
        const status = task.status === 'NEW' ? 'جديدة' : 'قيد التنفيذ';
        return `${index + 1}. ${task.title} (${status})`;
      })
      .join('\n');

    return `المهام التالية:\n\n${list}`;
  }
}
