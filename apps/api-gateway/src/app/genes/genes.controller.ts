import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { GenesService } from './genes.service';
import { CreateGeneDto, UpdateGeneDto } from './genes.dto';
import { Gene } from './genes.entity';

@Controller('genes')
export class GenesController {
  constructor(private readonly genesService: GenesService) {}

  /**
   * إنشاء سجل جين جديد
   * @param createGeneDto بيانات إنشاء الجين
   * @returns سجل الجين الذي تم إنشاؤه
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createGeneDto: CreateGeneDto): Promise<Gene> {
    return this.genesService.create(createGeneDto);
  }

  /**
   * استرداد جميع سجلات الجينات
   * @returns قائمة بسجلات الجينات
   */
  @Get()
  findAll(): Promise<Gene[]> {
    return this.genesService.findAll();
  }

  /**
   * استرداد سجل جين بواسطة المعرف
   * @param id معرف الجين
   * @returns سجل الجين
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Gene> {
    return this.genesService.findOne(+id);
  }

  /**
   * تحديث سجل جين موجود
   * @param id معرف الجين
   * @param updateGeneDto بيانات التحديث
   * @returns سجل الجين المحدث
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneDto: UpdateGeneDto): Promise<Gene> {
    return this.genesService.update(+id, updateGeneDto);
  }

  /**
   * حذف سجل جين (Soft Delete)
   * @param id معرف الجين
   * @returns نتيجة الحذف
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<{ deleted: boolean; message?: string }> {
    return this.genesService.remove(+id);
  }
}
