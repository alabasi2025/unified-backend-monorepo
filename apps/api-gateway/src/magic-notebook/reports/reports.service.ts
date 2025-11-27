import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * ينشئ تقريراً جديداً في قاعدة البيانات.
   * @param createReportDto بيانات إنشاء التقرير.
   * @returns التقرير المنشأ.
   */
  async create(createReportDto: CreateReportDto) {
    // نفترض أن اسم نموذج Prisma هو 'report'
    return this.prisma.report.create({
      data: createReportDto,
    });
  }

  /**
   * يسترجع جميع التقارير من قاعدة البيانات.
   * @returns قائمة بالتقارير.
   */
  async findAll() {
    return this.prisma.report.findMany();
  }

  /**
   * يسترجع تقريراً واحداً بناءً على المعرّف (ID).
   * @param id معرّف التقرير.
   * @returns التقرير المطابق.
   * @throws NotFoundException إذا لم يتم العثور على التقرير.
   */
  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  /**
   * يحدّث تقريراً موجوداً بناءً على المعرّف (ID).
   * @param id معرّف التقرير المراد تحديثه.
   * @param updateReportDto بيانات التحديث.
   * @returns التقرير المحدّث.
   * @throws NotFoundException إذا لم يتم العثور على التقرير.
   */
  async update(id: string, updateReportDto: UpdateReportDto) {
    // التحقق أولاً من وجود التقرير قبل محاولة التحديث
    await this.findOne(id); 
    
    return this.prisma.report.update({
      where: { id },
      data: updateReportDto,
    });
  }

  /**
   * يحذف تقريراً موجوداً بناءً على المعرّف (ID).
   * @param id معرّف التقرير المراد حذفه.
   * @returns التقرير المحذوف.
   * @throws NotFoundException إذا لم يتم العثور على التقرير.
   */
  async remove(id: string) {
    // التحقق أولاً من وجود التقرير قبل محاولة الحذف
    await this.findOne(id); 
    
    return this.prisma.report.delete({
      where: { id },
    });
  }
}