import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// افتراض وجود DTOs في المسار التالي
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  // حقن PrismaService في الـ constructor
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء قسم جديد
   * @param createSectionDto بيانات إنشاء القسم
   * @returns القسم المنشأ
   */
  async create(createSectionDto: CreateSectionDto) {
    return this.prisma.section.create({
      data: createSectionDto,
    });
  }

  /**
   * استرجاع جميع الأقسام
   * @returns قائمة بجميع الأقسام
   */
  async findAll() {
    return this.prisma.section.findMany();
  }

  /**
   * استرجاع قسم واحد بواسطة المعرف
   * @param id معرف القسم
   * @returns القسم المطلوب
   * @throws NotFoundException إذا لم يتم العثور على القسم
   */
  async findOne(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(\`Section with ID \${id} not found\`);
    }

    return section;
  }

  /**
   * تحديث قسم موجود
   * @param id معرف القسم
   * @param updateSectionDto بيانات التحديث
   * @returns القسم المحدث
   * @throws NotFoundException إذا لم يتم العثور على القسم
   */
  async update(id: string, updateSectionDto: UpdateSectionDto) {
    // التحقق أولاً من وجود القسم لإطلاق NotFoundException إذا لم يكن موجوداً
    await this.findOne(id); 

    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
    });
  }

  /**
   * حذف قسم موجود
   * @param id معرف القسم
   * @returns القسم المحذوف
   * @throws NotFoundException إذا لم يتم العثور على القسم
   */
  async remove(id: string) {
    // التحقق أولاً من وجود القسم لإطلاق NotFoundException إذا لم يكن موجوداً
    await this.findOne(id); 

    return this.prisma.section.delete({
      where: { id },
    });
  }
}
