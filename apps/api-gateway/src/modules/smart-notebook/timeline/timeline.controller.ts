// /home/ubuntu/timeline-module/controller.ts
// Controller مع RESTful APIs لـ Timeline Module

import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TimelineService } from './service';
import { CreateTimelineEventDto } from './dto-create';
import { UpdateTimelineEventDto } from './dto-update'; // تم تضمينه لنمط RESTful كامل
import { TimelineEventResponseDto } from './dto-response';

@ApiTags('Timeline Events')
@Controller('timeline-events')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  /**
   * إنشاء حدث تتبع زمني جديد
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء حدث تتبع زمني جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الحدث بنجاح', type: TimelineEventResponseDto })
  @ApiResponse({ status: 400, description: 'بيانات الإدخال غير صالحة' })
  async create(@Body() createTimelineEventDto: CreateTimelineEventDto): Promise<TimelineEventResponseDto> {
    // استدعاء خدمة إنشاء الحدث
    return this.timelineService.createEvent(createTimelineEventDto);
  }

  /**
   * استرداد جميع أحداث التتبع الزمني
   */
  @Get()
  @ApiOperation({ summary: 'استرداد جميع أحداث التتبع الزمني' })
  @ApiQuery({ name: 'entityType', required: false, description: 'تصفية حسب نوع الكيان (مثل Note)' })
  @ApiQuery({ name: 'entityId', required: false, description: 'تصفية حسب معرف الكيان' })
  @ApiResponse({ status: 200, description: 'قائمة بأحداث التتبع الزمني', type: [TimelineEventResponseDto] })
  async findAll(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
  ): Promise<TimelineEventResponseDto[]> {
    // استدعاء خدمة استرداد الأحداث مع التصفية
    return this.timelineService.findAll(entityType, entityId);
  }

  /**
   * استرداد حدث تتبع زمني محدد بواسطة المعرف
   */
  @Get(':id')
  @ApiOperation({ summary: 'استرداد حدث تتبع زمني محدد' })
  @ApiResponse({ status: 200, description: 'الحدث المطلوب', type: TimelineEventResponseDto })
  @ApiResponse({ status: 404, description: 'لم يتم العثور على الحدث' })
  async findOne(@Param('id') id: string): Promise<TimelineEventResponseDto> {
    // استدعاء خدمة استرداد حدث واحد
    return this.timelineService.findOne(id);
  }

  /**
   * حذف حدث تتبع زمني محدد
   * ملاحظة: هذا المسار موجود لنمط RESTful كامل، ولكن قد يتم تقييده في بيئة الإنتاج.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف حدث تتبع زمني محدد (غير موصى به للسجلات التاريخية)' })
  @ApiResponse({ status: 204, description: 'تم حذف الحدث بنجاح' })
  @ApiResponse({ status: 404, description: 'لم يتم العثور على الحدث' })
  async remove(@Param('id') id: string): Promise<void> {
    // استدعاء خدمة الحذف
    return this.timelineService.remove(id);
  }
}
