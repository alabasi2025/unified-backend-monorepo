// /home/ubuntu/archive-module/dto-create.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsUUID } from 'class-validator';

/**
 * @description DTO لإنشاء سجل أرشفة جديد.
 * يستخدم في طلبات POST لإنشاء سجل أرشفة يدوي.
 */
export class CreateArchiveDto {
  /**
   * @description نوع العنصر المؤرشف (مثل: 'Note', 'Document').
   * @example 'Note'
   */
  @ApiProperty({ description: 'نوع العنصر المؤرشف (مثل: Note, Document)', example: 'Note' })
  @IsString({ message: 'يجب أن يكون نوع العنصر نصًا' })
  @IsNotEmpty({ message: 'نوع العنصر مطلوب' })
  entityType: string;

  /**
   * @description المعرف الفريد للعنصر المؤرشف (UUID).
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({ description: 'المعرف الفريد للعنصر المؤرشف (UUID)', format: 'uuid' })
  @IsUUID('4', { message: 'يجب أن يكون معرف العنصر بصيغة UUID صالحة' })
  @IsNotEmpty({ message: 'معرف العنصر مطلوب' })
  entityId: string;

  /**
   * @description اسم العنصر المؤرشف أو وصف موجز له.
   * @example 'ملاحظات اجتماع الأسبوع الماضي'
   */
  @ApiProperty({ description: 'اسم العنصر المؤرشف أو وصف موجز له', example: 'ملاحظات اجتماع الأسبوع الماضي' })
  @IsString({ message: 'يجب أن يكون العنوان نصًا' })
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  title: string;

  /**
   * @description مسار الملف المؤرشف أو مرجع لمكان تخزينه.
   * @example '/archives/notes/2025/note-123.zip'
   */
  @ApiProperty({ description: 'مسار الملف المؤرشف أو مرجع لمكان تخزينه', example: '/archives/notes/2025/note-123.zip' })
  @IsString({ message: 'يجب أن يكون المسار نصًا' })
  @IsNotEmpty({ message: 'مسار الأرشفة مطلوب' })
  archivePath: string;

  /**
   * @description هل تمت الأرشفة بشكل تلقائي؟ (افتراضي: false للأرشفة اليدوية).
   * @example false
   */
  @ApiProperty({ description: 'هل تمت الأرشفة بشكل تلقائي؟', default: false, required: false })
  @IsBoolean({ message: 'يجب أن تكون القيمة منطقية (صحيح/خطأ)' })
  @IsOptional()
  isAutomatic?: boolean = false;

  /**
   * @description المعرف الفريد للمستخدم الذي قام بالأرشفة (UUID).
   * مطلوب إذا كانت الأرشفة يدوية.
   * @example 'f0e9d8c7-b6a5-4321-fedc-ba9876543210'
   */
  @ApiProperty({ description: 'المعرف الفريد للمستخدم الذي قام بالأرشفة (UUID)', format: 'uuid', required: false })
  @IsUUID('4', { message: 'يجب أن يكون معرف المستخدم بصيغة UUID صالحة' })
  @IsOptional()
  archivedBy?: string;

  /**
   * @description ملاحظات إضافية حول عملية الأرشفة.
   * @example 'تم أرشفة الملف بعد إغلاق المشروع.'
   */
  @ApiProperty({ description: 'ملاحظات إضافية حول عملية الأرشفة', required: false, nullable: true })
  @IsString({ message: 'يجب أن تكون الملاحظات نصًا' })
  @IsOptional()
  notes?: string;
}
