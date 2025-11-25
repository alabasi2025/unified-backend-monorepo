// service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // افتراض وجود PrismaService في مسار ../prisma/prisma.service
import { CreateAutoLinkDto } from './dto-create';
import { UpdateAutoLinkDto } from './dto-update';
import { AutoLink } from '@prisma/client';

/**
 * @class AutoLinksService
 * @description يوفر منطق الأعمال لإدارة الروابط التلقائية (AutoLinks).
 */
@Injectable()
export class AutoLinksService {
  // تعليق: حقن خدمة Prisma للتفاعل مع قاعدة البيانات
  constructor(private prisma: PrismaService) {}

  /**
   * @method create
   * @description ينشئ رابطًا تلقائيًا جديدًا.
   * @param createAutoLinkDto بيانات إنشاء الرابط.
   * @returns الرابط التلقائي الذي تم إنشاؤه.
   */
  async create(createAutoLinkDto: CreateAutoLinkDto): Promise<AutoLink> {
    try {
      // تعليق: التحقق من عدم وجود رابط مكرر بنفس الخصائص الفريدة
      const existingLink = await this.prisma.autoLink.findUnique({
        where: {
          sourceId_sourceType_targetId_targetType_linkType: {
            sourceId: createAutoLinkDto.sourceId,
            sourceType: createAutoLinkDto.sourceType,
            targetId: createAutoLinkDto.targetId,
            targetType: createAutoLinkDto.targetType,
            linkType: createAutoLinkDto.linkType,
          },
        },
      });

      if (existingLink) {
        throw new ConflictException('الرابط التلقائي موجود بالفعل.');
      }

      // تعليق: إنشاء الرابط في قاعدة البيانات
      return this.prisma.autoLink.create({
        data: createAutoLinkDto,
      });
    } catch (error) {
      // تعليق: إعادة إلقاء الأخطاء بعد تسجيلها أو معالجتها
      throw error;
    }
  }

  /**
   * @method findAll
   * @description يسترجع جميع الروابط التلقائية.
   * @returns قائمة بالروابط التلقائية.
   */
  async findAll(): Promise<AutoLink[]> {
    // تعليق: استرجاع جميع الروابط
    return this.prisma.autoLink.findMany();
  }

  /**
   * @method findOne
   * @description يسترجع رابطًا تلقائيًا بناءً على المعرف.
   * @param id المعرف الفريد للرابط.
   * @returns الرابط التلقائي.
   * @throws NotFoundException إذا لم يتم العثور على الرابط.
   */
  async findOne(id: string): Promise<AutoLink> {
    // تعليق: البحث عن رابط بالمعرف
    const link = await this.prisma.autoLink.findUnique({
      where: { id },
    });

    // تعليق: التحقق من وجود الرابط
    if (!link) {
      throw new NotFoundException(`الرابط التلقائي بالمعرف ${id} غير موجود.`);
    }

    return link;
  }

  /**
   * @method update
   * @description يحدث رابطًا تلقائيًا موجودًا.
   * @param id المعرف الفريد للرابط.
   * @param updateAutoLinkDto بيانات التحديث.
   * @returns الرابط التلقائي المحدث.
   * @throws NotFoundException إذا لم يتم العثور على الرابط.
   */
  async update(id: string, updateAutoLinkDto: UpdateAutoLinkDto): Promise<AutoLink> {
    try {
      // تعليق: تحديث الرابط في قاعدة البيانات
      return await this.prisma.autoLink.update({
        where: { id },
        data: updateAutoLinkDto,
      });
    } catch (error) {
      // تعليق: معالجة خطأ عدم العثور على سجل (P2025 في Prisma)
      if (error.code === 'P2025') {
        throw new NotFoundException(`الرابط التلقائي بالمعرف ${id} غير موجود.`);
      }
      throw error;
    }
  }

  /**
   * @method remove
   * @description يحذف رابطًا تلقائيًا موجودًا.
   * @param id المعرف الفريد للرابط.
   * @returns الرابط التلقائي المحذوف.
   * @throws NotFoundException إذا لم يتم العثور على الرابط.
   */
  async remove(id: string): Promise<AutoLink> {
    try {
      // تعليق: حذف الرابط من قاعدة البيانات
      return await this.prisma.autoLink.delete({
        where: { id },
      });
    } catch (error) {
      // تعليق: معالجة خطأ عدم العثور على سجل (P2025 في Prisma)
      if (error.code === 'P2025') {
        throw new NotFoundException(`الرابط التلقائي بالمعرف ${id} غير موجود.`);
      }
      throw error;
    }
  }
}
