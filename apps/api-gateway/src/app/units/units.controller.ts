import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto, UpdateUnitDto } from '@semop/contracts';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء وحدة قياس جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الوحدة بنجاح.' })
  @ApiResponse({ status: 409, description: 'اسم الوحدة موجود بالفعل.' })
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Get()
  @ApiOperation({ summary: 'الحصول على جميع وحدات القياس' })
  findAll() {
    return this.unitsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'الحصول على وحدة قياس بواسطة ID' })
  @ApiResponse({ status: 200, description: 'تم العثور على الوحدة.' })
  @ApiResponse({ status: 404, description: 'الوحدة غير موجودة.' })
  findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث وحدة قياس موجودة' })
  @ApiResponse({ status: 200, description: 'تم تحديث الوحدة بنجاح.' })
  @ApiResponse({ status: 404, description: 'الوحدة غير موجودة.' })
  @ApiResponse({ status: 409, description: 'اسم الوحدة موجود بالفعل.' })
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف وحدة قياس (Soft Delete)' })
  @ApiResponse({ status: 204, description: 'تم حذف الوحدة بنجاح.' })
  @ApiResponse({ status: 404, description: 'الوحدة غير موجودة.' })
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'استعادة وحدة قياس محذوفة' })
  @ApiResponse({ status: 200, description: 'تم استعادة الوحدة بنجاح.' })
  @ApiResponse({ status: 404, description: 'الوحدة غير موجودة أو لم يتم حذفها.' })
  restore(@Param('id') id: string) {
    return this.unitsService.restore(id);
  }
}
