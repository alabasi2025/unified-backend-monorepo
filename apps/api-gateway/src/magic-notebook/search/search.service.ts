import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// افتراض أن هذه الـ DTOs موجودة
// export class CreateSearchDto { /* ... */ }
// export class UpdateSearchDto { /* ... */ }

@Injectable()
export class SearchService {
  // افتراض أن PrismaService موجودة في المسار الصحيح
  // وافتراض أن هناك نموذج (model) اسمه 'search' في ملف schema.prisma
  constructor(private prisma: PrismaService) {}

  /**
   * ينشئ سجل بحث جديد في قاعدة البيانات.
   * @param createSearchDto بيانات إنشاء سجل البحث.
   * @returns سجل البحث المنشأ.
   */
  async create(createSearchDto: any) {
    // في تطبيق حقيقي، سيتم استخدام CreateSearchDto
    return this.prisma.search.create({
      data: createSearchDto,
    });
  }

  /**
   * يجلب جميع سجلات البحث.
   * @returns قائمة بسجلات البحث.
   */
  async findAll() {
    return this.prisma.search.findMany();
  }

  /**
   * يجلب سجل بحث واحد باستخدام المعرّف (ID).
   * @param id معرّف سجل البحث.
   * @returns سجل البحث المطابق.
   * @throws NotFoundException إذا لم يتم العثور على سجل البحث.
   */
  async findOne(id: string) {
    const searchRecord = await this.prisma.search.findUnique({
      where: { id },
    });
    if (!searchRecord) {
      throw new NotFoundException(`Search record with ID ${id} not found`);
    }
    return searchRecord;
  }

  /**
   * يحدّث سجل بحث موجود باستخدام المعرّف (ID).
   * @param id معرّف سجل البحث المراد تحديثه.
   * @param updateSearchDto بيانات التحديث.
   * @returns سجل البحث المحدّث.
   * @throws NotFoundException إذا لم يتم العثور على سجل البحث.
   */
  async update(id: string, updateSearchDto: any) {
    // التحقق أولاً من وجود السجل قبل محاولة التحديث
    await this.findOne(id); 

    // في تطبيق حقيقي، سيتم استخدام UpdateSearchDto
    return this.prisma.search.update({
      where: { id },
      data: updateSearchDto,
    });
  }

  /**
   * يحذف سجل بحث موجود باستخدام المعرّف (ID).
   * @param id معرّف سجل البحث المراد حذفه.
   * @returns سجل البحث المحذوف.
   * @throws NotFoundException إذا لم يتم العثور على سجل البحث.
   */
  async remove(id: string) {
    // التحقق أولاً من وجود السجل قبل محاولة الحذف
    await this.findOne(id); 
    
    return this.prisma.search.delete({
      where: { id },
    });
  }
}