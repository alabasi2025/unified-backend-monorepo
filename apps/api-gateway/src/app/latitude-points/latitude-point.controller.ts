import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LatitudePointService } from './latitude-point.service';
import { CreateLatitudePointDto } from '@semop/contracts';
import { UpdateLatitudePointDto } from '@semop/contracts';
import { LatitudePoint } from './latitude_point.entity';

@ApiTags('latitude-points')
@Controller('latitude-points')
export class LatitudePointController {
  constructor(private readonly latitudePointService: LatitudePointService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء نقطة خط عرض جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء نقطة خط العرض بنجاح.', type: LatitudePoint })
  @ApiResponse({ status: 400, description: 'بيانات الإدخال غير صالحة.' })
  async create(@Body() createLatitudePointDto: CreateLatitudePointDto): Promise<LatitudePoint> {
    return this.latitudePointService.create(createLatitudePointDto);
  }

  @Get()
  @ApiOperation({ summary: 'الحصول على جميع نقاط خطوط العرض' })
  @ApiResponse({ status: 200, description: 'قائمة بنقاط خطوط العرض.', type: [LatitudePoint] })
  async findAll(): Promise<LatitudePoint[]> {
    return this.latitudePointService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'الحصول على نقطة خط عرض بواسطة المعرف' })
  @ApiResponse({ status: 200, description: 'نقطة خط العرض المطلوبة.', type: LatitudePoint })
  @ApiResponse({ status: 404, description: 'نقطة خط العرض غير موجودة.' })
  async findOne(@Param('id') id: string): Promise<LatitudePoint> {
    return this.latitudePointService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث نقطة خط عرض موجودة' })
  @ApiResponse({ status: 200, description: 'تم تحديث نقطة خط العرض بنجاح.', type: LatitudePoint })
  @ApiResponse({ status: 404, description: 'نقطة خط العرض غير موجودة.' })
  @ApiResponse({ status: 400, description: 'بيانات التحديث غير صالحة.' })
  async update(@Param('id') id: string, @Body() updateLatitudePointDto: UpdateLatitudePointDto): Promise<LatitudePoint> {
    return this.latitudePointService.update(+id, updateLatitudePointDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف نقطة خط عرض' })
  @ApiResponse({ status: 204, description: 'تم حذف نقطة خط العرض بنجاح.' })
  @ApiResponse({ status: 404, description: 'نقطة خط العرض غير موجودة.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.latitudePointService.remove(+id);
  }
}
