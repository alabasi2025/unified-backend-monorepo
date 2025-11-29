import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// يجب استبدال المسارات التالية بالمسارات الصحيحة لملفات DTOs
import { CreateStickyNoteDto } from './dto/create-sticky-note.dto';
import { UpdateStickyNoteDto } from './dto/update-sticky-note.dto';

@Injectable()
export class StickyNotesService {
  // نفترض أن Prisma Model يسمى StickyNote
  private readonly modelName = 'StickyNote';

  constructor(private prisma: PrismaService) {}

  /**
   * ينشئ ملاحظة لاصقة جديدة في قاعدة البيانات.
   * @param createStickyNoteDto بيانات إنشاء الملاحظة.
   * @returns الملاحظة اللاصقة المنشأة.
   */
  async create(createStickyNoteDto: CreateStickyNoteDto) {
    // نستخدم prisma['stickyNote'] للوصول إلى model في Prisma Client
    // نفترض أن اسم الـ model في schema.prisma هو stickyNote (camelCase)
    return this.prisma.stickyNote.create({
      data: createStickyNoteDto,
    });
  }

  /**
   * يسترجع جميع الملاحظات اللاصقة.
   * @returns قائمة بجميع الملاحظات اللاصقة.
   */
  async findAll() {
    return this.prisma.stickyNote.findMany();
  }

  /**
   * يسترجع ملاحظة لاصقة واحدة بناءً على المعرّف (ID).
   * @param id معرّف الملاحظة اللاصقة.
   * @returns الملاحظة اللاصقة المطلوبة.
   * @throws NotFoundException إذا لم يتم العثور على الملاحظة.
   */
  async findOne(id: string) {
    const stickyNote = await this.prisma.stickyNote.findUnique({
      where: { id },
    });

    if (!stickyNote) {
      throw new NotFoundException(\`\${this.modelName} with ID \${id} not found\`);
    }

    return stickyNote;
  }

  /**
   * يحدّث ملاحظة لاصقة موجودة بناءً على المعرّف (ID).
   * @param id معرّف الملاحظة اللاصقة.
   * @param updateStickyNoteDto بيانات التحديث.
   * @returns الملاحظة اللاصقة المحدّثة.
   * @throws NotFoundException إذا لم يتم العثور على الملاحظة.
   */
  async update(id: string, updateStickyNoteDto: UpdateStickyNoteDto) {
    // التحقق أولاً من وجود الملاحظة
    await this.findOne(id);

    return this.prisma.stickyNote.update({
      where: { id },
      data: updateStickyNoteDto,
    });
  }

  /**
   * يحذف ملاحظة لاصقة موجودة بناءً على المعرّف (ID).
   * @param id معرّف الملاحظة اللاصقة.
   * @returns الملاحظة اللاصقة المحذوفة.
   * @throws NotFoundException إذا لم يتم العثور على الملاحظة.
   */
  async remove(id: string) {
    // التحقق أولاً من وجود الملاحظة
    await this.findOne(id);

    return this.prisma.stickyNote.delete({
      where: { id },
    });
  }
}