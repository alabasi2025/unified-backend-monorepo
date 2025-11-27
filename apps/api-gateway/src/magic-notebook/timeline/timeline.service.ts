import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// افتراض أن هذه الـ DTOs موجودة في الـ module
import { CreateTimelineEventDto } from './dto/create-timeline-event.dto';
import { UpdateTimelineEventDto } from './dto/update-timeline-event.dto';

@Injectable()
export class TimelineService {
  // حقن PrismaService في الـ constructor
  constructor(private prisma: PrismaService) {}

  /**
   * ينشئ حدث جديد في الجدول الزمني (Timeline Event).
   * @param createTimelineEventDto بيانات إنشاء الحدث.
   * @returns الحدث المنشأ.
   */
  async create(createTimelineEventDto: CreateTimelineEventDto) {
    // نفترض أن اسم الموديل في Prisma هو 'timelineEvent'
    return this.prisma.timelineEvent.create({
      data: createTimelineEventDto,
    });
  }

  /**
   * يجلب جميع أحداث الجدول الزمني.
   * @returns قائمة بأحداث الجدول الزمني.
   */
  async findAll() {
    return this.prisma.timelineEvent.findMany();
  }

  /**
   * يجلب حدث واحد بالاعتماد على الـ ID.
   * @param id معرف الحدث.
   * @returns الحدث المطلوب.
   * @throws NotFoundException إذا لم يتم العثور على الحدث.
   */
  async findOne(id: string) {
    const timelineEvent = await this.prisma.timelineEvent.findUnique({
      where: { id },
    });

    if (!timelineEvent) {
      throw new NotFoundException(`Timeline Event with ID ${id} not found`);
    }

    return timelineEvent;
  }

  /**
   * يحدث حدث موجود في الجدول الزمني.
   * @param id معرف الحدث المراد تحديثه.
   * @param updateTimelineEventDto بيانات التحديث.
   * @returns الحدث المحدث.
   * @throws NotFoundException إذا لم يتم العثور على الحدث.
   */
  async update(id: string, updateTimelineEventDto: UpdateTimelineEventDto) {
    // التحقق من وجود الحدث أولاً
    await this.findOne(id);

    return this.prisma.timelineEvent.update({
      where: { id },
      data: updateTimelineEventDto,
    });
  }

  /**
   * يحذف حدث موجود في الجدول الزمني.
   * @param id معرف الحدث المراد حذفه.
   * @returns الحدث المحذوف.
   * @throws NotFoundException إذا لم يتم العثور على الحدث.
   */
  async remove(id: string) {
    // التحقق من وجود الحدث أولاً
    await this.findOne(id);

    return this.prisma.timelineEvent.delete({
      where: { id },
    });
  }
}