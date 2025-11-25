// service.ts

import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // افتراض وجود PrismaService
import { CreateNotebookDto } from './dtos/dto-create';
import { UpdateNotebookDto } from './dtos/dto-update';
import { NotebookResponseDto } from './dtos/dto-response';
import { Notebook } from '@prisma/client'; // افتراض أن Notebook هو نوع Prisma

/**
 * @class NotebooksService
 * @description يوفر منطق الأعمال لإدارة دفاتر الملاحظات.
 */
@Injectable()
export class NotebooksService {
  // حقن خدمة Prisma
  constructor(private prisma: PrismaService) {}

  /**
   * @method create
   * @description إنشاء دفتر ملاحظات جديد للمستخدم المحدد.
   * @param ownerId معرف المستخدم المالك.
   * @param data بيانات إنشاء الدفتر.
   * @returns NotebookResponseDto
   */
  async create(ownerId: string, data: CreateNotebookDto): Promise<NotebookResponseDto> {
    // التحقق من وجود الدفتر الأب إذا تم تحديده
    if (data.parentId) {
      const parent = await this.prisma.notebook.findUnique({
        where: { id: data.parentId, ownerId },
      });
      if (!parent) {
        throw new NotFoundException('الدفتر الأب غير موجود أو لا تملكه.');
      }
    }

    try {
      const notebook = await this.prisma.notebook.create({
        data: {
          title: data.title,
          description: data.description,
          ownerId: ownerId,
          parentId: data.parentId,
        },
      });
      // تحويل نموذج Prisma إلى DTO للاستجابة
      return this.toResponseDto(notebook);
    } catch (error) {
      // معالجة خطأ التكرار (مثلاً: تكرار العنوان لنفس المالك)
      if (error.code === 'P2002') {
        throw new BadRequestException('لديك بالفعل دفتر ملاحظات بهذا العنوان.');
      }
      throw error;
    }
  }

  /**
   * @method findAll
   * @description استرداد جميع دفاتر الملاحظات للمستخدم المحدد.
   * @param ownerId معرف المستخدم المالك.
   * @returns مصفوفة من NotebookResponseDto
   */
  async findAll(ownerId: string): Promise<NotebookResponseDto[]> {
    const notebooks = await this.prisma.notebook.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'asc' },
    });
    return notebooks.map(this.toResponseDto);
  }

  /**
   * @method findOne
   * @description استرداد دفتر ملاحظات محدد بواسطة المعرف، مع التحقق من الملكية.
   * @param ownerId معرف المستخدم المالك.
   * @param id معرف الدفتر.
   * @returns NotebookResponseDto
   */
  async findOne(ownerId: string, id: string): Promise<NotebookResponseDto> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id, ownerId },
    });

    if (!notebook) {
      throw new NotFoundException(`دفتر الملاحظات بالمعرف ${id} غير موجود أو لا تملكه.`);
    }

    return this.toResponseDto(notebook);
  }

  /**
   * @method update
   * @description تحديث دفتر ملاحظات محدد، مع التحقق من الملكية.
   * @param ownerId معرف المستخدم المالك.
   * @param id معرف الدفتر.
   * @param data بيانات التحديث.
   * @returns NotebookResponseDto
   */
  async update(ownerId: string, id: string, data: UpdateNotebookDto): Promise<NotebookResponseDto> {
    // التحقق من وجود الدفتر أولاً
    await this.findOne(ownerId, id);

    // التحقق من وجود الدفتر الأب الجديد إذا تم تحديده
    if (data.parentId !== undefined && data.parentId !== null) {
      const parent = await this.prisma.notebook.findUnique({
        where: { id: data.parentId, ownerId },
      });
      if (!parent) {
        throw new NotFoundException('الدفتر الأب الجديد غير موجود أو لا تملكه.');
      }
      // منع تعيين الدفتر كأب لنفسه أو لأحد أطفاله (منع الحلقات)
      if (id === data.parentId) {
        throw new BadRequestException('لا يمكن أن يكون الدفتر أبًا لنفسه.');
      }
      // يمكن إضافة منطق أكثر تعقيدًا للتحقق من الحلقات الهرمية هنا
    }

    try {
      const updatedNotebook = await this.prisma.notebook.update({
        where: { id, ownerId },
        data: {
          title: data.title,
          description: data.description,
          parentId: data.parentId,
          isShared: data.isShared,
        },
      });
      return this.toResponseDto(updatedNotebook);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('لديك بالفعل دفتر ملاحظات بهذا العنوان.');
      }
      throw error;
    }
  }

  /**
   * @method remove
   * @description حذف دفتر ملاحظات محدد، مع التحقق من الملكية.
   * @param ownerId معرف المستخدم المالك.
   * @param id معرف الدفتر.
   */
  async remove(ownerId: string, id: string): Promise<void> {
    // التحقق من وجود الدفتر أولاً
    await this.findOne(ownerId, id);

    // ملاحظة: Prisma model يستخدم onDelete: Cascade، مما يعني أن حذف الدفتر الأب سيحذف جميع الأبناء تلقائيًا.
    // إذا كان هذا غير مرغوب فيه، يجب تغيير onDelete في Prisma schema وإضافة منطق هنا.
    await this.prisma.notebook.delete({
      where: { id, ownerId },
    });
  }

  /**
   * @method toResponseDto
   * @description تحويل نموذج Prisma إلى NotebookResponseDto.
   * @param notebook نموذج دفتر الملاحظات من Prisma.
   * @returns NotebookResponseDto
   */
  private toResponseDto(notebook: Notebook): NotebookResponseDto {
    const { id, title, description, ownerId, status, isShared, parentId, createdAt, updatedAt } = notebook;
    return {
      id,
      title,
      description,
      ownerId,
      status,
      isShared,
      parentId,
      createdAt,
      updatedAt,
    };
  }
}
