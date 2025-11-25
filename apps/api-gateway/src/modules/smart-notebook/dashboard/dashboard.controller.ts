// dashboard.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateRecentActivityDto } from './dto/create-recent-activity.dto';
import { UpdateRecentActivityDto } from './dto/update-recent-activity.dto';
import { RecentActivityResponseDto } from './dto/response-recent-activity.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

/**
 * @description: وحدة التحكم الخاصة بلوحة التحكم (Dashboard Controller).
 * تتعامل مع طلبات HTTP المتعلقة بالإحصائيات وسجلات النشاط الحديثة.
 */
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // =================================================================
  // واجهة برمجة تطبيقات الإحصائيات (Statistics API)
  // =================================================================

  /**
   * @description: جلب إحصائيات لوحة التحكم الرئيسية.
   * @returns كائن يحتوي على الإحصائيات المجمعة.
   */
  @Get('stats')
  @ApiOperation({ summary: 'جلب إحصائيات لوحة التحكم الرئيسية' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم جلب الإحصائيات بنجاح',
    type: Object, // يمكن تعريف DTO خاص للإحصائيات إذا كانت معقدة
  })
  async getStats() {
    // استدعاء دالة الخدمة لجلب الإحصائيات
    return this.dashboardService.getDashboardStats();
  }

  // =================================================================
  // واجهات برمجة تطبيقات سجلات النشاط الحديثة (RecentActivity APIs)
  // =================================================================

  /**
   * @description: إنشاء سجل نشاط جديد.
   * @param createRecentActivityDto - بيانات إنشاء سجل النشاط.
   * @returns سجل النشاط الذي تم إنشاؤه.
   */
  @Post('activities')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء سجل نشاط جديد' })
  @ApiBody({ type: CreateRecentActivityDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'تم إنشاء سجل النشاط بنجاح',
    type: RecentActivityResponseDto,
  })
  async createActivity(
    @Body() createRecentActivityDto: CreateRecentActivityDto,
  ): Promise<RecentActivityResponseDto> {
    // استدعاء دالة الخدمة لإنشاء سجل النشاط
    return this.dashboardService.createActivity(createRecentActivityDto);
  }

  /**
   * @description: جلب أحدث سجلات النشاط.
   * @param limit - الحد الأقصى لعدد السجلات المراد جلبها.
   * @returns قائمة بسجلات النشاط.
   */
  @Get('activities')
  @ApiOperation({ summary: 'جلب أحدث سجلات النشاط' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'الحد الأقصى لعدد السجلات (الافتراضي: 10)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم جلب سجلات النشاط بنجاح',
    type: [RecentActivityResponseDto],
  })
  async findAllActivities(
    @Query('limit') limit: number = 10,
  ): Promise<RecentActivityResponseDto[]> {
    // استدعاء دالة الخدمة لجلب سجلات النشاط
    return this.dashboardService.findAllActivities(Number(limit));
  }

  /**
   * @description: جلب سجل نشاط واحد بواسطة المعرف.
   * @param id - معرف سجل النشاط (UUID).
   * @returns سجل النشاط.
   */
  @Get('activities/:id')
  @ApiOperation({ summary: 'جلب سجل نشاط بواسطة المعرف' })
  @ApiParam({
    name: 'id',
    description: 'معرف سجل النشاط (UUID)',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم جلب سجل النشاط بنجاح',
    type: RecentActivityResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على سجل النشاط',
  })
  async findOneActivity(
    @Param('id') id: string,
  ): Promise<RecentActivityResponseDto> {
    // استدعاء دالة الخدمة لجلب سجل نشاط واحد
    return this.dashboardService.findOneActivity(id);
  }

  /**
   * @description: تحديث سجل نشاط موجود.
   * @param id - معرف سجل النشاط (UUID).
   * @param updateRecentActivityDto - بيانات التحديث.
   * @returns سجل النشاط المحدث.
   */
  @Patch('activities/:id')
  @ApiOperation({ summary: 'تحديث سجل نشاط موجود' })
  @ApiParam({
    name: 'id',
    description: 'معرف سجل النشاط (UUID)',
    type: String,
  })
  @ApiBody({ type: UpdateRecentActivityDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تحديث سجل النشاط بنجاح',
    type: RecentActivityResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على سجل النشاط',
  })
  async updateActivity(
    @Param('id') id: string,
    @Body() updateRecentActivityDto: UpdateRecentActivityDto,
  ): Promise<RecentActivityResponseDto> {
    // استدعاء دالة الخدمة لتحديث سجل النشاط
    return this.dashboardService.updateActivity(id, updateRecentActivityDto);
  }

  /**
   * @description: حذف سجل نشاط.
   * @param id - معرف سجل النشاط (UUID).
   */
  @Delete('activities/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف سجل نشاط' })
  @ApiParam({
    name: 'id',
    description: 'معرف سجل النشاط (UUID)',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'تم حذف سجل النشاط بنجاح',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على سجل النشاط',
  })
  async removeActivity(@Param('id') id: string): Promise<void> {
    // استدعاء دالة الخدمة لحذف سجل النشاط
    return this.dashboardService.removeActivity(id);
  }
}
