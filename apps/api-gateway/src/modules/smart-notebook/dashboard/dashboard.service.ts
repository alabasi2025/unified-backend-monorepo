// dashboard.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // افتراض وجود PrismaService
import { CreateRecentActivityDto } from './dto/create-recent-activity.dto';
import { UpdateRecentActivityDto } from './dto/update-recent-activity.dto';
import { RecentActivityResponseDto } from './dto/response-recent-activity.dto';

/**
 * @description: خدمة لوحة التحكم (Dashboard Service).
 * تتولى منطق العمل المتعلق بسجلات النشاط الحديثة والإحصائيات المجمعة.
 */
@Injectable()
export class DashboardService {
  // حقن خدمة Prisma للتعامل مع قاعدة البيانات
  constructor(private prisma: PrismaService) {}

  /**
   * @description: تحويل كائن Prisma Model إلى Response DTO.
   * @param activity - كائن سجل النشاط من Prisma.
   * @returns كائن Response DTO.
   */
  private toResponseDto(activity: any): RecentActivityResponseDto {
    return {
      id: activity.id,
      activityType: activity.activityType,
      description: activity.description,
      userId: activity.userId,
      entityId: activity.entityId,
      createdAt: activity.createdAt,
    };
  }

  // =================================================================
  // عمليات CRUD لسجلات النشاط الحديثة (RecentActivity)
  // =================================================================

  /**
   * @description: إنشاء سجل نشاط جديد.
   * @param createRecentActivityDto - بيانات إنشاء سجل النشاط.
   * @returns سجل النشاط الذي تم إنشاؤه.
   */
  async createActivity(
    createRecentActivityDto: CreateRecentActivityDto,
  ): Promise<RecentActivityResponseDto> {
    // منطق العمل: يمكن إضافة تحقق من صلاحية المستخدم أو تنسيق البيانات قبل الحفظ
    const activity = await this.prisma.recentActivity.create({
      data: createRecentActivityDto,
    });
    return this.toResponseDto(activity);
  }

  /**
   * @description: جلب جميع سجلات النشاط الحديثة.
   * @param limit - الحد الأقصى لعدد السجلات المراد جلبها.
   * @returns قائمة بسجلات النشاط.
   */
  async findAllActivities(limit: number = 10): Promise<RecentActivityResponseDto[]> {
    // منطق العمل: جلب أحدث السجلات بترتيب زمني عكسي
    const activities = await this.prisma.recentActivity.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
    return activities.map(this.toResponseDto);
  }

  /**
   * @description: جلب سجل نشاط واحد بواسطة المعرف.
   * @param id - معرف سجل النشاط.
   * @returns سجل النشاط.
   */
  async findOneActivity(id: string): Promise<RecentActivityResponseDto> {
    const activity = await this.prisma.recentActivity.findUnique({
      where: { id },
    });

    if (!activity) {
      throw new NotFoundException(`لم يتم العثور على سجل النشاط بالمعرف ${id}`);
    }

    return this.toResponseDto(activity);
  }

  /**
   * @description: تحديث سجل نشاط موجود.
   * @param id - معرف سجل النشاط.
   * @param updateRecentActivityDto - بيانات التحديث.
   * @returns سجل النشاط المحدث.
   */
  async updateActivity(
    id: string,
    updateRecentActivityDto: UpdateRecentActivityDto,
  ): Promise<RecentActivityResponseDto> {
    try {
      const activity = await this.prisma.recentActivity.update({
        where: { id },
        data: updateRecentActivityDto,
      });
      return this.toResponseDto(activity);
    } catch (error) {
      // معالجة خطأ عدم العثور على السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`لم يتم العثور على سجل النشاط بالمعرف ${id} للتحديث`);
      }
      throw error;
    }
  }

  /**
   * @description: حذف سجل نشاط.
   * @param id - معرف سجل النشاط.
   */
  async removeActivity(id: string): Promise<void> {
    try {
      await this.prisma.recentActivity.delete({
        where: { id },
      });
    } catch (error) {
      // معالجة خطأ عدم العثور على السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`لم يتم العثور على سجل النشاط بالمعرف ${id} للحذف`);
      }
      throw error;
    }
  }

  // =================================================================
  // عمليات الإحصائيات المجمعة (Dashboard Statistics)
  // =================================================================

  /**
   * @description: جلب إحصائيات لوحة التحكم الرئيسية.
   * @returns كائن يحتوي على الإحصائيات المجمعة.
   */
  async getDashboardStats(): Promise<any> {
    // منطق العمل: محاكاة جلب إحصائيات مجمعة من قاعدة البيانات
    // في تطبيق حقيقي، سيتم استخدام عمليات تجميع (aggregation) معقدة هنا.

    // محاكاة جلب عدد المستخدمين النشطين
    const activeUsers = 42; // افتراض
    // محاكاة جلب إجمالي عدد الملاحظات
    const totalNotes = 1500; // افتراض
    // محاكاة جلب عدد الأنشطة في آخر 24 ساعة
    const activitiesLast24h = await this.prisma.recentActivity.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    return {
      activeUsers,
      totalNotes,
      activitiesLast24h,
      // يمكن إضافة المزيد من الإحصائيات هنا
      topActivityTypes: [
        { type: 'NOTE_CREATED', count: 50 },
        { type: 'USER_LOGIN', count: 30 },
        { type: 'NOTE_UPDATED', count: 20 },
      ],
    };
  }
}
