// /home/ubuntu/archive-module/dto-update.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { CreateArchiveDto } from './create-archive.dto';

/**
 * @description DTO لتحديث سجل أرشفة موجود.
 * يستخدم في طلبات PATCH.
 * يرث من CreateArchiveDto ويجعل جميع الحقول اختيارية.
 */
export class UpdateArchiveDto extends CreateArchiveDto {
  /**
   * @description نوع العنصر المؤرشف (مثل: 'Note', 'Document').
   * @example 'Note'
   */
  @ApiProperty({ description: 'نوع العنصر المؤرشف (مثل: Note, Document)', example: 'Note', required: false })
  @IsString({ message: 'يجب أن يكون نوع العنصر نصًا' })
  @IsOptional()
  entityType?: string;

  /**
   * @description المعرف الفريد للعنصر المؤرشف (UUID).
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({ description: 'المعرف الفريد للعنصر المؤرشف (UUID)', format: 'uuid', required: false })
  @IsUUID('4', { message: 'يجب أن يكون معرف العنصر بصيغة UUID صالحة' })
  @IsOptional()
  entityId?: string;

  /**
   * @description اسم العنصر المؤرشف أو وصف موجز له.
   * @example 'ملاحظات اجتماع الأسبوع الماضي'
   */
  @ApiProperty({ description: 'اسم العنصر المؤرشف أو وصف موجز له', example: 'ملاحظات اجتماع الأسبوع الماضي', required: false })
  @IsString({ message: 'يجب أن يكون العنوان نصًا' })
  @IsOptional()
  title?: string;

  /**
   * @description مسار الملف المؤرشف أو مرجع لمكان تخزينه.
   * @example '/archives/notes/2025/note-123.zip'
   */
  @ApiProperty({ description: 'مسار الملف المؤرشف أو مرجع لمكان تخزينه', example: '/archives/notes/2025/note-123.zip', required: false })
  @IsString({ message: 'يجب أن يكون المسار نصًا' })
  @IsOptional()
  archivePath?: string;

  /**
   * @description هل تمت الأرشفة بشكل تلقائي؟
   * @example false
   */
  @ApiProperty({ description: 'هل تمت الأرشفة بشكل تلقائي؟', required: false })
  @IsBoolean({ message: 'يجب أن تكون القيمة منطقية (صحيح/خطأ)' })
  @IsOptional()
  isAutomatic?: boolean;

  /**
   * @description المعرف الفريد للمستخدم الذي قام بالأرشفة (UUID).
   * @example 'f0e9d8c7-b6a5-4321-fedc-ba9876543210'
   */
  @ApiProperty({ description: 'المعرف الفريد للمستخدم الذي قام بالأرشفة (UUID)', format: 'uuid', required: false })
  @IsUUID('4', { message: 'يجب أن يكون معرف المستخدم بصيغة UUID صالحة' })
  @IsOptional()
  archivedBy?: string;

  /**
   * @description تاريخ ووقت استرجاع العنصر من الأرشيف.
   * @example '2025-11-25T10:00:00.000Z'
   */
  @ApiProperty({ description: 'تاريخ ووقت استرجاع العنصر من الأرشيف', type: 'string', format: 'date-time', required: false, nullable: true })
  @IsOptional()
  restoredAt?: Date;

  /**
   * @description المعرف الفريد للمستخدم الذي قام بالاسترجاع (UUID).
   * @example '1a2b3c4d-5e6f-7890-abcd-ef0123456789'
   */
  @ApiProperty({ description: 'المعرف الفريد للمستخدم الذي قام بالاسترجاع (UUID)', format: 'uuid', required: false, nullable: true })
  @IsUUID('4', { message: 'يجب أن يكون معرف المستخدم بصيغة UUID صالحة' })
  @IsOptional()
  restoredBy?: string;

  /**
   * @description ملاحظات إضافية حول عملية الأرشفة أو الاسترجاع.
   * @example 'تم تحديث مسار الأرشيف بعد نقل الخادم.'
   */
  @ApiProperty({ description: 'ملاحظات إضافية حول عملية الأرشفة أو الاسترجاع', required: false, nullable: true })
  @IsString({ message: 'يجب أن تكون الملاحظات نصًا' })
  @IsOptional()
  notes?: string;
}
