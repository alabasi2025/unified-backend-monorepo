// /home/ubuntu/timeline-module/service.ts
// Service implementation لـ Timeline Module

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // افتراض وجود PrismaService في مسار '../prisma/prisma.service'
import { CreateTimelineEventDto } from './dto-create';
import { TimelineEventResponseDto } from './dto-response';

@Injectable()
export class TimelineService {
  // حقن خدمة Prisma للتفاعل مع قاعدة البيانات
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء حدث جديد في التتبع الزمني
   * @param createTimelineEventDto بيانات الحدث الجديد
   * @returns الحدث الذي تم إنشاؤه
   */
  async createEvent(createTimelineEventDto: CreateTimelineEventDto): Promise<TimelineEventResponseDto> {
    // #1: تسجيل الحدث في قاعدة البيانات
    const event = await this.prisma.timelineEvent.create({
      data: {
        ...createTimelineEventDto,
        // تحويل الـ payload إلى JSON إذا كان موجودًا
        payload: createTimelineEventDto.payload ? JSON.stringify(createTimelineEventDto.payload) : undefined,
      },
    });

    // #2: تحويل نموذج Prisma إلى Response DTO
    return new TimelineEventResponseDto({
      ...event,
      payload: event.payload ? (event.payload as any) : null, // التأكد من أن الـ payload هو كائن
    });
  }

  /**
   * استرداد جميع أحداث التتبع الزمني مع إمكانية التصفية
   * @param entityType نوع الكيان للتصفية (اختياري)
   * @param entityId معرف الكيان للتصفية (اختياري)
   * @returns قائمة بأحداث التتبع الزمني
   */
  async findAll(entityType?: string, entityId?: string): Promise<TimelineEventResponseDto[]> {
    // #1: بناء شروط التصفية
    const where = {
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
    };

    // #2: استرداد الأحداث من قاعدة البيانات
    const events = await this.prisma.timelineEvent.findMany({
      where,
      orderBy: {
        createdAt: 'desc', // ترتيب تنازلي حسب تاريخ الإنشاء (الأحدث أولاً)
      },
    });

    // #3: تحويل نماذج Prisma إلى Response DTOs
    return events.map(event => new TimelineEventResponseDto({
      ...event,
      payload: event.payload ? (event.payload as any) : null,
    }));
  }

  /**
   * استرداد حدث تتبع زمني محدد بواسطة المعرف
   * @param id معرف الحدث
   * @returns الحدث المطلوب
   */
  async findOne(id: string): Promise<TimelineEventResponseDto> {
    // #1: البحث عن الحدث
    const event = await this.prisma.timelineEvent.findUnique({
      where: { id },
    });

    // #2: التحقق من وجود الحدث
    if (!event) {
      throw new NotFoundException(`لم يتم العثور على حدث التتبع الزمني بالمعرف: ${id}`);
    }

    // #3: تحويل نموذج Prisma إلى Response DTO
    return new TimelineEventResponseDto({
      ...event,
      payload: event.payload ? (event.payload as any) : null,
    });
  }

  /**
   * حذف حدث تتبع زمني محدد
   * ملاحظة: لا يوصى بحذف أحداث التتبع الزمني لأنها سجلات تاريخية.
   * @param id معرف الحدث
   */
  async remove(id: string): Promise<void> {
    try {
      await this.prisma.timelineEvent.delete({
        where: { id },
      });
    } catch (error) {
      // التعامل مع حالة عدم العثور على الحدث
      if (error.code === 'P2025') {
        throw new NotFoundException(`لم يتم العثور على حدث التتبع الزمني بالمعرف: ${id}`);
      }
      throw error;
    }
  }
}
