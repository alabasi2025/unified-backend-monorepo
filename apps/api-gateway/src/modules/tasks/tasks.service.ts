import { Injectable } from '@nestjs/common';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  assigneeAvatar?: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  project?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number;
  attachments?: string[];
  comments?: TaskComment[];
  subtasks?: SubTask[];
}

export interface TaskComment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'تصميم واجهة نظام المحاسبة',
      description: 'تصميم واجهة مستخدم احترافية لنظام المحاسبة مع دعم RTL',
      status: 'done',
      priority: 'high',
      assignee: 'أحمد محمد',
      assigneeAvatar: 'AM',
      dueDate: new Date('2025-11-15'),
      createdAt: new Date('2025-11-01'),
      updatedAt: new Date('2025-11-15'),
      tags: ['frontend', 'ui/ux', 'accounting'],
      project: 'SEMOP ERP',
      estimatedHours: 40,
      actualHours: 38,
      progress: 100,
      subtasks: [
        { id: 's1', title: 'تصميم دليل الحسابات', completed: true },
        { id: 's2', title: 'تصميم القيود اليومية', completed: true },
        { id: 's3', title: 'تصميم التقارير', completed: true },
      ],
    },
    {
      id: '2',
      title: 'بناء API نظام المخزون',
      description: 'تطوير REST API لنظام إدارة المخزون والمستودعات',
      status: 'in-progress',
      priority: 'high',
      assignee: 'سارة أحمد',
      assigneeAvatar: 'SA',
      dueDate: new Date('2025-11-25'),
      createdAt: new Date('2025-11-10'),
      updatedAt: new Date('2025-11-21'),
      tags: ['backend', 'api', 'inventory'],
      project: 'SEMOP ERP',
      estimatedHours: 60,
      actualHours: 35,
      progress: 65,
      subtasks: [
        { id: 's1', title: 'إنشاء Entities', completed: true },
        { id: 's2', title: 'بناء Controllers', completed: true },
        { id: 's3', title: 'كتابة Tests', completed: false },
      ],
    },
    {
      id: '3',
      title: 'إضافة نظام الإشعارات',
      description: 'تطوير نظام إشعارات فوري باستخدام WebSocket',
      status: 'todo',
      priority: 'medium',
      assignee: 'محمد علي',
      assigneeAvatar: 'MA',
      dueDate: new Date('2025-12-01'),
      createdAt: new Date('2025-11-18'),
      updatedAt: new Date('2025-11-18'),
      tags: ['backend', 'websocket', 'notifications'],
      project: 'SEMOP ERP',
      estimatedHours: 30,
      actualHours: 0,
      progress: 0,
      subtasks: [
        { id: 's1', title: 'إعداد WebSocket', completed: false },
        { id: 's2', title: 'تصميم UI الإشعارات', completed: false },
      ],
    },
    {
      id: '4',
      title: 'تحسين أداء Dashboard',
      description: 'تحسين سرعة تحميل لوحة التحكم وتقليل استهلاك الذاكرة',
      status: 'review',
      priority: 'medium',
      assignee: 'فاطمة حسن',
      assigneeAvatar: 'FH',
      dueDate: new Date('2025-11-22'),
      createdAt: new Date('2025-11-12'),
      updatedAt: new Date('2025-11-20'),
      tags: ['frontend', 'performance', 'optimization'],
      project: 'SEMOP ERP',
      estimatedHours: 20,
      actualHours: 18,
      progress: 90,
      subtasks: [
        { id: 's1', title: 'تحليل الأداء', completed: true },
        { id: 's2', title: 'تطبيق Lazy Loading', completed: true },
        { id: 's3', title: 'Code Review', completed: false },
      ],
    },
    {
      id: '5',
      title: 'كتابة توثيق API',
      description: 'توثيق شامل لجميع endpoints باستخدام Swagger',
      status: 'in-progress',
      priority: 'low',
      assignee: 'خالد يوسف',
      assigneeAvatar: 'KY',
      dueDate: new Date('2025-11-28'),
      createdAt: new Date('2025-11-15'),
      updatedAt: new Date('2025-11-21'),
      tags: ['documentation', 'api', 'swagger'],
      project: 'SEMOP ERP',
      estimatedHours: 25,
      actualHours: 12,
      progress: 45,
      subtasks: [
        { id: 's1', title: 'توثيق Accounting APIs', completed: true },
        { id: 's2', title: 'توثيق Inventory APIs', completed: false },
        { id: 's3', title: 'توثيق Sales APIs', completed: false },
      ],
    },
    {
      id: '6',
      title: 'إضافة نظام التقارير المتقدمة',
      description: 'بناء نظام تقارير ديناميكي مع تصدير PDF/Excel',
      status: 'todo',
      priority: 'high',
      assignee: 'نور الدين',
      assigneeAvatar: 'ND',
      dueDate: new Date('2025-12-05'),
      createdAt: new Date('2025-11-19'),
      updatedAt: new Date('2025-11-19'),
      tags: ['frontend', 'reports', 'pdf', 'excel'],
      project: 'SEMOP ERP',
      estimatedHours: 50,
      actualHours: 0,
      progress: 0,
    },
    {
      id: '7',
      title: 'تطبيق نظام الصلاحيات',
      description: 'تطبيق RBAC (Role-Based Access Control) في كامل النظام',
      status: 'in-progress',
      priority: 'urgent',
      assignee: 'ليلى عمر',
      assigneeAvatar: 'LO',
      dueDate: new Date('2025-11-23'),
      createdAt: new Date('2025-11-08'),
      updatedAt: new Date('2025-11-21'),
      tags: ['security', 'rbac', 'authentication'],
      project: 'SEMOP ERP',
      estimatedHours: 45,
      actualHours: 32,
      progress: 70,
      subtasks: [
        { id: 's1', title: 'تصميم نموذج الصلاحيات', completed: true },
        { id: 's2', title: 'تطبيق Guards', completed: true },
        { id: 's3', title: 'اختبار الصلاحيات', completed: false },
      ],
    },
    {
      id: '8',
      title: 'إضافة Multi-tenancy',
      description: 'دعم تعدد الشركات في نفس النظام',
      status: 'todo',
      priority: 'medium',
      assignee: 'عمر سعيد',
      assigneeAvatar: 'OS',
      dueDate: new Date('2025-12-10'),
      createdAt: new Date('2025-11-20'),
      updatedAt: new Date('2025-11-20'),
      tags: ['backend', 'architecture', 'multi-tenancy'],
      project: 'SEMOP ERP',
      estimatedHours: 80,
      actualHours: 0,
      progress: 0,
    },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findByStatus(status: string): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  findActive(): Task[] {
    return this.tasks.filter(
      (task) => task.status === 'in-progress' || task.status === 'review'
    );
  }

  findCompleted(): Task[] {
    return this.tasks.filter((task) => task.status === 'done');
  }

  findOne(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  create(taskData: Partial<Task>): Task {
    const newTask: Task = {
      id: (this.tasks.length + 1).toString(),
      title: taskData.title || 'مهمة جديدة',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee || 'غير محدد',
      dueDate: taskData.dueDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: taskData.tags || [],
      project: taskData.project,
      estimatedHours: taskData.estimatedHours,
      actualHours: 0,
      progress: 0,
      subtasks: taskData.subtasks || [],
    };

    this.tasks.push(newTask);
    return newTask;
  }

  update(id: string, taskData: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return undefined;

    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      updatedAt: new Date(),
    };

    return this.tasks[index];
  }

  delete(id: string): boolean {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  getStatistics() {
    const total = this.tasks.length;
    const byStatus = {
      todo: this.tasks.filter((t) => t.status === 'todo').length,
      inProgress: this.tasks.filter((t) => t.status === 'in-progress').length,
      review: this.tasks.filter((t) => t.status === 'review').length,
      done: this.tasks.filter((t) => t.status === 'done').length,
    };

    const byPriority = {
      low: this.tasks.filter((t) => t.priority === 'low').length,
      medium: this.tasks.filter((t) => t.priority === 'medium').length,
      high: this.tasks.filter((t) => t.priority === 'high').length,
      urgent: this.tasks.filter((t) => t.priority === 'urgent').length,
    };

    const completionRate = Math.round((byStatus.done / total) * 100);

    return {
      total,
      byStatus,
      byPriority,
      completionRate,
    };
  }
}
