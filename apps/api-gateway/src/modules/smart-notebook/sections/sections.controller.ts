import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SectionsService } from './service';
import { CreateSectionDto } from './dto-create';
import { UpdateSectionDto } from './dto-update';
import { SectionResponseDto } from './dto-response';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

/**
 * SectionsController
 * المتحكم المسؤول عن معالجة طلبات HTTP المتعلقة بإدارة الأقسام (Sections).
 */
@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  /**
   * إنشاء قسم جديد.
   * @param createSectionDto بيانات إنشاء القسم.
   * @returns القسم الذي تم إنشاؤه.
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء قسم جديد' })
  @ApiBody({ type: CreateSectionDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'تم إنشاء القسم بنجاح', type: SectionResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'الدفتر غير موجود' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات غير صالحة أو تعارض في الترتيب' })
  async create(@Body() createSectionDto: CreateSectionDto): Promise<SectionResponseDto> {
    const section = await this.sectionsService.create(createSectionDto);
    return SectionResponseDto.fromPrisma(section);
  } // API Count: 1

  /**
   * الحصول على جميع الأقسام لدفتر ملاحظات محدد.
   * @param notebookId معرف الدفتر.
   * @returns قائمة بالأقسام.
   */
  @Get()
  @ApiOperation({ summary: 'الحصول على جميع الأقسام لدفتر ملاحظات محدد' })
  @ApiQuery({ name: 'notebookId', description: 'معرف الدفتر (UUID)', required: true, type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'قائمة الأقسام', type: [SectionResponseDto] })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'معرف الدفتر غير صالح' })
  async findAllByNotebook(@Query('notebookId') notebookId: string): Promise<SectionResponseDto[]> {
    // يجب إضافة تحقق من صحة notebookId هنا (مثلاً باستخدام Pipe)
    const sections = await this.sectionsService.findAllByNotebook(notebookId);
    return sections.map(SectionResponseDto.fromPrisma);
  } // API Count: 2

  /**
   * الحصول على قسم واحد بواسطة المعرف.
   * @param id معرف القسم.
   * @returns القسم.
   */
  @Get(':id')
  @ApiOperation({ summary: 'الحصول على قسم بواسطة المعرف' })
  @ApiParam({ name: 'id', description: 'معرف القسم (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'بيانات القسم', type: SectionResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'القسم غير موجود' })
  async findOne(@Param('id') id: string): Promise<SectionResponseDto> {
    const section = await this.sectionsService.findOne(id);
    return SectionResponseDto.fromPrisma(section);
  } // API Count: 3

  /**
   * تحديث قسم موجود.
   * @param id معرف القسم.
   * @param updateSectionDto بيانات التحديث.
   * @returns القسم المحدث.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'تحديث قسم موجود' })
  @ApiParam({ name: 'id', description: 'معرف القسم (UUID)', type: String })
  @ApiBody({ type: UpdateSectionDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم تحديث القسم بنجاح', type: SectionResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'القسم غير موجود' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات غير صالحة أو تعارض في الترتيب' })
  async update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto): Promise<SectionResponseDto> {
    const section = await this.sectionsService.update(id, updateSectionDto);
    return SectionResponseDto.fromPrisma(section);
  } // API Count: 4

  /**
   * حذف قسم بواسطة المعرف.
   * @param id معرف القسم.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف قسم بواسطة المعرف' })
  @ApiParam({ name: 'id', description: 'معرف القسم (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'تم حذف القسم بنجاح' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'القسم غير موجود' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.sectionsService.remove(id);
  } // API Count: 5
}
