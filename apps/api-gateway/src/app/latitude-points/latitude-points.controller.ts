import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { LatitudePointsService } from './latitude_points.service';
import { CreateLatitudePointDto, UpdateLatitudePointDto } from './dto/latitude_point.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('latitude-points')
@Controller('latitude-points')
export class LatitudePointsController {
  constructor(private readonly latitudePointsService: LatitudePointsService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء نقطة خط عرض جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء النقطة بنجاح.' })
  create(@Body() createLatitudePointDto: CreateLatitudePointDto) {
    return this.latitudePointsService.create(createLatitudePointDto);
  }

  @Get()
  @ApiOperation({ summary: 'الحصول على جميع نقاط خطوط العرض' })
  @ApiResponse({ status: 200, description: 'قائمة بجميع النقاط.' })
  findAll() {
    return this.latitudePointsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'الحصول على نقطة خط عرض بواسطة المعرف' })
  @ApiResponse({ status: 200, description: 'النقطة المطلوبة.' })
  @ApiResponse({ status: 404, description: 'النقطة غير موجودة.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.latitudePointsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث نقطة خط عرض بواسطة المعرف' })
  @ApiResponse({ status: 200, description: 'تم تحديث النقطة بنجاح.' })
  @ApiResponse({ status: 404, description: 'النقطة غير موجودة.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLatitudePointDto: UpdateLatitudePointDto) {
    return this.latitudePointsService.update(id, updateLatitudePointDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف نقطة خط عرض بواسطة المعرف' })
  @ApiResponse({ status: 200, description: 'تم حذف النقطة بنجاح.' })
  @ApiResponse({ status: 404, description: 'النقطة غير موجودة.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.latitudePointsService.remove(id);
  }
}
