// /home/ubuntu/archive-module/controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ArchiveService } from './service';
import { CreateArchiveDto } from './dto-create';
import { UpdateArchiveDto } from './dto-update';
import { ArchiveResponseDto } from './dto-response';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

/**
 * @description وحدة التحكم (Controller) لإدارة عمليات الأرشفة.
 * توفر واجهات RESTful API لإدارة سجلات الأرشفة.
 */
@ApiTags('Archive Management - إدارة الأرشفة')
@Controller('archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  /**
   * @description إنشاء سجل أرشفة جديد (يدوي أو تلقائي).
   * @param createArchiveDto بيانات سجل الأرشفة.
   * @returns سجل الأرشفة المُنشأ.
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء سجل أرشفة جديد', description: 'يستخدم لأرشفة عنصر يدويًا أو تسجيل عملية أرشفة تلقائية.' })
  @ApiBody({ type: CreateArchiveDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'تم إنشاء سجل الأرشفة بنجاح.', type: ArchiveResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات الطلب غير صالحة.' })
  async create(@Body() createArchiveDto: CreateArchiveDto): Promise<ArchiveResponseDto> {
    const archive = await this.archiveService.create(createArchiveDto);
    return archive as ArchiveResponseDto;
  }

  /**
   * @description استرداد جميع سجلات الأرشفة.
   * @returns قائمة بسجلات الأرشفة.
   */
  @Get()
  @ApiOperation({ summary: 'استرداد جميع سجلات الأرشفة', description: 'يسترجع قائمة بجميع سجلات الأرشفة الموجودة في النظام.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'قائمة بسجلات الأرشفة.', type: [ArchiveResponseDto] })
  async findAll(): Promise<ArchiveResponseDto[]> {
    const archives = await this.archiveService.findAll();
    return archives as ArchiveResponseDto[];
  }

  /**
   * @description استرداد سجل أرشفة واحد بواسطة المعرف.
   * @param id المعرف الفريد لسجل الأرشفة.
   * @returns سجل الأرشفة.
   */
  @Get(':id')
  @ApiOperation({ summary: 'استرداد سجل أرشفة بواسطة المعرف', description: 'يسترجع تفاصيل سجل أرشفة محدد باستخدام المعرف الفريد (UUID).' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد لسجل الأرشفة', type: 'string', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'سجل الأرشفة المطلوب.', type: ArchiveResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على سجل الأرشفة.' })
  async findOne(@Param('id') id: string): Promise<ArchiveResponseDto> {
    const archive = await this.archiveService.findOne(id);
    return archive as ArchiveResponseDto;
  }

  /**
   * @description تحديث سجل أرشفة موجود.
   * @param id المعرف الفريد لسجل الأرشفة.
   * @param updateArchiveDto بيانات التحديث.
   * @returns سجل الأرشفة المُحدَّث.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'تحديث سجل أرشفة', description: 'يحدث معلومات سجل أرشفة محدد.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد لسجل الأرشفة', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateArchiveDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم تحديث سجل الأرشفة بنجاح.', type: ArchiveResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على سجل الأرشفة.' })
  async update(@Param('id') id: string, @Body() updateArchiveDto: UpdateArchiveDto): Promise<ArchiveResponseDto> {
    const archive = await this.archiveService.update(id, updateArchiveDto);
    return archive as ArchiveResponseDto;
  }

  /**
   * @description حذف سجل أرشفة.
   * @param id المعرف الفريد لسجل الأرشفة.
   * @returns سجل الأرشفة المحذوف.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف سجل أرشفة', description: 'يحذف سجل أرشفة محدد بشكل دائم.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد لسجل الأرشفة', type: 'string', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'تم حذف سجل الأرشفة بنجاح.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على سجل الأرشفة.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.archiveService.remove(id);
  }

  /**
   * @description استرجاع عنصر من الأرشيف (تحديث حقول الاسترجاع).
   * @param id المعرف الفريد لسجل الأرشفة.
   * @param restoredBy المعرف الفريد للمستخدم الذي قام بالاسترجاع.
   * @returns سجل الأرشفة المُحدَّث.
   */
  @Post(':id/restore')
  @ApiOperation({ summary: 'استرجاع عنصر من الأرشيف', description: 'يسجل عملية استرجاع عنصر من الأرشيف عن طريق تحديث حقول restoredAt و restoredBy.' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد لسجل الأرشفة', type: 'string', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { restoredBy: { type: 'string', format: 'uuid', description: 'المعرف الفريد للمستخدم الذي قام بالاسترجاع' } } } })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم استرجاع العنصر بنجاح.', type: ArchiveResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'لم يتم العثور على سجل الأرشفة.' })
  async restore(@Param('id') id: string, @Body('restoredBy') restoredBy: string): Promise<ArchiveResponseDto> {
    if (!restoredBy) {
      throw new Error('يجب تحديد المعرف الفريد للمستخدم الذي قام بالاسترجاع (restoredBy).');
    }
    const archive = await this.archiveService.restore(id, restoredBy);
    return archive as ArchiveResponseDto;
  }
}
