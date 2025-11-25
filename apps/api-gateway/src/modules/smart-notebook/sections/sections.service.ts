import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // افتراض وجود PrismaService
import { CreateSectionDto } from './dto-create';
import { UpdateSectionDto } from './dto-update';

// تعريف نوع القسم (Section) لغرض المحاكاة، يفترض أنه يأتي من Prisma Client
type Section = {
  id: string;
  name: string;
  rank: number;
  notebookId: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * SectionsService
 * يوفر منطق الأعمال لإدارة الأقسام (Sections) داخل الدفاتر.
 * يتضمن عمليات CRUD الأساسية ومنطق الترتيب.
 */
@Injectable()
export class SectionsService {
  // حقن خدمة Prisma للتفاعل مع قاعدة البيانات
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء قسم جديد (Section).
   * @param createSectionDto بيانات إنشاء القسم.
   * @returns القسم الذي تم إنشاؤه.
   */
  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const { notebookId, name, rank } = createSectionDto;

    // 1. التحقق من وجود الدفتر (Notebook)
    // نفترض وجود نموذج Notebook في Prisma
    const notebook = await this.prisma.notebook.findUnique({ where: { id: notebookId } });
    if (!notebook) {
      throw new NotFoundException(`الدفتر بالمعرف ${notebookId} غير موجود.`);
    }

    let finalRank = rank;

    // 2. إذا لم يتم تحديد الترتيب (rank)، يتم تعيينه إلى الترتيب التالي
    if (finalRank === undefined || finalRank === null) {
      const maxRankSection = await this.prisma.section.findFirst({
        where: { notebookId },
        orderBy: { rank: 'desc' },
        select: { rank: true },
      });
      finalRank = (maxRankSection?.rank || -1) + 1;
    } else {
      // 3. إذا تم تحديد الترتيب، يجب التأكد من عدم وجود قسم آخر بنفس الترتيب
      const existingSection = await this.prisma.section.findUnique({
        where: { notebookId_rank: { notebookId, rank: finalRank } },
      });
      if (existingSection) {
        // يمكننا هنا إما رمي خطأ أو إعادة ترتيب الأقسام الأخرى.
        // لتبسيط المثال، سنقوم برمي خطأ ونطلب من العميل اختيار ترتيب آخر.
        // في تطبيق حقيقي، يفضل تنفيذ منطق إعادة الترتيب التلقائي.
        throw new BadRequestException(`الترتيب ${finalRank} محجوز بالفعل في هذا الدفتر.`);
      }
    }

    // 4. إنشاء القسم في قاعدة البيانات
    const section = await this.prisma.section.create({
      data: {
        name,
        notebookId,
        rank: finalRank,
      },
    });

    return section as Section;
  }

  /**
   * الحصول على جميع الأقسام لدفتر ملاحظات محدد.
   * @param notebookId معرف الدفتر.
   * @returns قائمة بالأقسام مرتبة حسب الترتيب (rank).
   */
  async findAllByNotebook(notebookId: string): Promise<Section[]> {
    // التحقق من وجود الدفتر اختياري هنا، لكنه يضيف صلابة
    // ...

    // استرجاع الأقسام مرتبة حسب الترتيب
    const sections = await this.prisma.section.findMany({
      where: { notebookId },
      orderBy: { rank: 'asc' },
    });

    return sections as Section[];
  }

  /**
   * الحصول على قسم واحد بواسطة المعرف.
   * @param id معرف القسم.
   * @returns القسم.
   */
  async findOne(id: string): Promise<Section> {
    const section = await this.prisma.section.findUnique({ where: { id } });

    if (!section) {
      throw new NotFoundException(`القسم بالمعرف ${id} غير موجود.`);
    }

    return section as Section;
  }

  /**
   * تحديث قسم موجود.
   * @param id معرف القسم.
   * @param updateSectionDto بيانات التحديث.
   * @returns القسم المحدث.
   */
  async update(id: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
    const { name, rank } = updateSectionDto;

    // 1. التحقق من وجود القسم
    const existingSection = await this.prisma.section.findUnique({ where: { id } });
    if (!existingSection) {
      throw new NotFoundException(`القسم بالمعرف ${id} غير موجود.`);
    }

    // 2. إذا تم تحديث الترتيب (rank)، يجب التحقق من عدم تعارضه
    if (rank !== undefined && rank !== null && rank !== existingSection.rank) {
      const { notebookId } = existingSection;

      // التحقق من وجود قسم آخر بنفس الترتيب في نفس الدفتر
      const conflictingSection = await this.prisma.section.findUnique({
        where: { notebookId_rank: { notebookId, rank } },
      });

      if (conflictingSection && conflictingSection.id !== id) {
        // يمكن هنا تنفيذ منطق إعادة الترتيب التلقائي
        throw new BadRequestException(`الترتيب ${rank} محجوز بالفعل في هذا الدفتر. يرجى اختيار ترتيب آخر.`);
      }
    }

    // 3. تحديث القسم
    const section = await this.prisma.section.update({
      where: { id },
      data: {
        name,
        rank,
      },
    });

    return section as Section;
  }

  /**
   * حذف قسم بواسطة المعرف.
   * @param id معرف القسم.
   */
  async remove(id: string): Promise<void> {
    // 1. التحقق من وجود القسم قبل الحذف
    const existingSection = await this.prisma.section.findUnique({ where: { id } });
    if (!existingSection) {
      throw new NotFoundException(`القسم بالمعرف ${id} غير موجود.`);
    }

    // 2. حذف القسم
    await this.prisma.section.delete({ where: { id } });

    // ملاحظة: في تطبيق حقيقي، يجب التعامل مع حذف جميع الصفحات (Pages) المرتبطة بهذا القسم.
  }
}
