// controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AutoLinksService } from './service';
import { CreateAutoLinkDto } from './dto-create';
import { UpdateAutoLinkDto } from './dto-update';
import { AutoLinkResponseDto } from './dto-response';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

/**
 * @class AutoLinksController
 * @description المتحكم الخاص بالروابط التلقائية (AutoLinks).
 */
@ApiTags('Auto Links')
@Controller('auto-links')
@UsePipes(new ValidationPipe({ transform: true })) // تطبيق التحقق من الصحة على مستوى المتحكم
export class AutoLinksController {
  // تعليق: حقن خدمة الروابط التلقائية
  constructor(private readonly autoLinksService: AutoLinksService) {}

  /**
   * @method create
   * @description إنشاء رابط تلقائي جديد.
   * @param createAutoLinkDto بيانات إنشاء الرابط.
   * @returns الرابط التلقائي الذي تم إنشاؤه.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء رابط تلقائي جديد' })
  @ApiBody({ type: CreateAutoLinkDto, description: 'بيانات الرابط التلقائي المراد إنشاؤه' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'تم إنشاء الرابط بنجاح', type: AutoLinkResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'الرابط موجود بالفعل' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات الإدخال غير صالحة' })
  async create(@Body() createAutoLinkDto: CreateAutoLinkDto): Promise<AutoLinkResponseDto> {
    // تعليق: استدعاء خدمة الإنشاء وتحويل النتيجة إلى DTO للاستجابة
    const autoLink = await this.autoLinksService.create(createAutoLinkDto);
    return new AutoLinkResponseDto(autoLink);
  }

  /**
   * @method findAll
   * @description استرجاع جميع الروابط التلقائية.
   * @returns قائمة بالروابط التلقائية.
   */
  @Get()
  @ApiOperation({ summary: 'استرجاع جميع الروابط التلقائية' })
  @ApiResponse({ status: HttpStatus.OK, description: 'قائمة الروابط التلقائية', type: [AutoLinkResponseDto] })
  async findAll(): Promise<AutoLinkResponseDto[]> {
    // تعليق: استدعاء خدمة الاسترجاع وتحويل القائمة إلى DTOs للاستجابة
    const autoLinks = await this.autoLinksService.findAll();
    return autoLinks.map(link => new AutoLinkResponseDto(link));
  }

  /**
   * @method findOne
   * @description استرجاع رابط تلقائي بناءً على المعرف.
   * @param id المعرف الفريد للرابط.
   * @returns الرابط التلقائي.
   */
  @Get(':id')
  @ApiOperation({ summary: 'استرجاع رابط تلقائي بناءً على المعرف' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للرابط', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @ApiResponse({ status: HttpStatus.OK, description: 'الرابط التلقائي المطلوب', type: AutoLinkResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'الرابط غير موجود' })
  async findOne(@Param('id') id: string): Promise<AutoLinkResponseDto> {
    // تعليق: استدعاء خدمة الاسترجاع بالمعرف وتحويل النتيجة إلى DTO للاستجابة
    const autoLink = await this.autoLinksService.findOne(id);
    return new AutoLinkResponseDto(autoLink);
  }

  /**
   * @method update
   * @description تحديث رابط تلقائي موجود.
   * @param id المعرف الفريد للرابط.
   * @param updateAutoLinkDto بيانات التحديث.
   * @returns الرابط التلقائي المحدث.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'تحديث رابط تلقائي موجود' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للرابط', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @ApiBody({ type: UpdateAutoLinkDto, description: 'بيانات التحديث' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم تحديث الرابط بنجاح', type: AutoLinkResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'الرابط غير موجود' })
  async update(@Param('id') id: string, @Body() updateAutoLinkDto: UpdateAutoLinkDto): Promise<AutoLinkResponseDto> {
    // تعليق: استدعاء خدمة التحديث وتحويل النتيجة إلى DTO للاستجابة
    const autoLink = await this.autoLinksService.update(id, updateAutoLinkDto);
    return new AutoLinkResponseDto(autoLink);
  }

  /**
   * @method remove
   * @description حذف رابط تلقائي موجود.
   * @param id المعرف الفريد للرابط.
   * @returns الرابط التلقائي المحذوف.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'حذف رابط تلقائي' })
  @ApiParam({ name: 'id', description: 'المعرف الفريد للرابط', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم حذف الرابط بنجاح', type: AutoLinkResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'الرابط غير موجود' })
  async remove(@Param('id') id: string): Promise<AutoLinkResponseDto> {
    // تعليق: استدعاء خدمة الحذف وتحويل النتيجة إلى DTO للاستجابة
    const autoLink = await this.autoLinksService.remove(id);
    return new AutoLinkResponseDto(autoLink);
  }
}
