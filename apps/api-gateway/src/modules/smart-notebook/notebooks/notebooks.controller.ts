// controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { NotebooksService } from './service';
import { CreateNotebookDto } from './dtos/dto-create';
import { UpdateNotebookDto } from './dtos/dto-update';
import { NotebookResponseDto } from './dtos/dto-response';

// افتراض أن هذا المعرف يتم استخراجه من الـ Token أو الـ Session في بيئة NestJS حقيقية
const MOCK_OWNER_ID = 'user-uuid-12345';

/**
 * @class NotebooksController
 * @description المتحكم الخاص بإدارة دفاتر الملاحظات (Notebooks).
 */
@ApiTags('Notebooks')
@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  /**
   * @method create
   * @description إنشاء دفتر ملاحظات جديد.
   */
  @Post()
  @ApiOperation({ summary: 'إنشاء دفتر ملاحظات جديد' })
  @ApiBody({ type: CreateNotebookDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء دفتر الملاحظات بنجاح.', type: NotebookResponseDto })
  @ApiResponse({ status: 400, description: 'بيانات الإدخال غير صالحة.' })
  async create(@Body() createNotebookDto: CreateNotebookDto): Promise<NotebookResponseDto> {
    // في تطبيق حقيقي، سيتم تمرير معرف المستخدم (ownerId) من الـ Request
    return this.notebooksService.create(MOCK_OWNER_ID, createNotebookDto);
  }

  /**
   * @method findAll
   * @description استرداد جميع دفاتر الملاحظات للمستخدم.
   */
  @Get()
  @ApiOperation({ summary: 'استرداد جميع دفاتر الملاحظات للمستخدم' })
  @ApiResponse({ status: 200, description: 'قائمة دفاتر الملاحظات.', type: [NotebookResponseDto] })
  async findAll(): Promise<NotebookResponseDto[]> {
    return this.notebooksService.findAll(MOCK_OWNER_ID);
  }

  /**
   * @method findOne
   * @description استرداد دفتر ملاحظات محدد بواسطة المعرف.
   */
  @Get(':id')
  @ApiOperation({ summary: 'استرداد دفتر ملاحظات بواسطة المعرف' })
  @ApiParam({ name: 'id', description: 'معرف دفتر الملاحظات (UUID)' })
  @ApiResponse({ status: 200, description: 'دفتر الملاحظات المطلوب.', type: NotebookResponseDto })
  @ApiResponse({ status: 404, description: 'دفتر الملاحظات غير موجود.' })
  async findOne(@Param('id') id: string): Promise<NotebookResponseDto> {
    return this.notebooksService.findOne(MOCK_OWNER_ID, id);
  }

  /**
   * @method update
   * @description تحديث دفتر ملاحظات محدد بواسطة المعرف.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'تحديث دفتر ملاحظات بواسطة المعرف' })
  @ApiParam({ name: 'id', description: 'معرف دفتر الملاحظات (UUID)' })
  @ApiBody({ type: UpdateNotebookDto })
  @ApiResponse({ status: 200, description: 'تم تحديث دفتر الملاحظات بنجاح.', type: NotebookResponseDto })
  @ApiResponse({ status: 404, description: 'دفتر الملاحظات غير موجود.' })
  async update(@Param('id') id: string, @Body() updateNotebookDto: UpdateNotebookDto): Promise<NotebookResponseDto> {
    return this.notebooksService.update(MOCK_OWNER_ID, id, updateNotebookDto);
  }

  /**
   * @method remove
   * @description حذف دفتر ملاحظات محدد بواسطة المعرف.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف دفتر ملاحظات بواسطة المعرف' })
  @ApiParam({ name: 'id', description: 'معرف دفتر الملاحظات (UUID)' })
  @ApiResponse({ status: 204, description: 'تم حذف دفتر الملاحظات بنجاح.' })
  @ApiResponse({ status: 404, description: 'دفتر الملاحظات غير موجود.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.notebooksService.remove(MOCK_OWNER_ID, id);
  }
}
