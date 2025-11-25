// /home/ubuntu/archive-module/dto-response.ts

import { ApiProperty } from '@nestjs/swagger';

/**
 * @description DTO للاستجابة (Response) لسجل الأرشفة.
 * يمثل الشكل الذي سيعود به سجل الأرشفة من الـ API.
 */
export class ArchiveResponseDto {
  /**
   * @description المعرف الفريد لسجل الأرشفة.
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({ description: 'المعرف الفريد لسجل الأرشفة', format: 'uuid' })
  id: string;

  /**
   * @description نوع العنصر المؤرشف (مثل: 'Note', 'Document').
   * @example 'Note'
   */
  @ApiProperty({ description: 'نوع العنصر المؤرشف', example: 'Note' })
  entityType: string;

  /**
   * @description المعرف الفريد للعنصر المؤرشف.
   * @example 'f0e9d8c7-b6a5-4321-fedc-ba9876543210'
   */
  @ApiProperty({ description: 'المعرف الفريد للعنصر المؤرشف', format: 'uuid' })
  entityId: string;

  /**
   * @description اسم العنصر المؤرشف أو وصف موجز له.
   * @example 'ملاحظات اجتماع الأسبوع الماضي'
   */
  @ApiProperty({ description: 'اسم العنصر المؤرشف' })
  title: string;

  /**
   * @description مسار الملف المؤرشف أو مرجع لمكان تخزينه.
   * @example '/archives/notes/2025/note-123.zip'
   */
  @ApiProperty({ description: 'مسار الملف المؤرشف' })
  archivePath: string;

  /**
   * @description تاريخ ووقت إنشاء سجل الأرشفة.
   * @example '2025-11-25T08:00:00.000Z'
   */
  @ApiProperty({ description: 'تاريخ ووقت إنشاء سجل الأرشفة', type: 'string', format: 'date-time' })
  archivedAt: Date;

  /**
   * @description هل تمت الأرشفة بشكل تلقائي؟
   * @example false
   */
  @ApiProperty({ description: 'هل تمت الأرشفة بشكل تلقائي؟' })
  isAutomatic: boolean;

  /**
   * @description المعرف الفريد للمستخدم الذي قام بالأرشفة (إذا كانت يدوية).
   * @example '1a2b3c4d-5e6f-7890-abcd-ef0123456789'
   */
  @ApiProperty({ description: 'المعرف الفريد للمستخدم الذي قام بالأرشفة', format: 'uuid', nullable: true })
  archivedBy: string | null;

  /**
   * @description تاريخ ووقت استرجاع العنصر من الأرشيف.
   * @example '2025-11-25T10:00:00.000Z'
   */
  @ApiProperty({ description: 'تاريخ ووقت استرجاع العنصر من الأرشيف', type: 'string', format: 'date-time', nullable: true })
  restoredAt: Date | null;

  /**
   * @description المعرف الفريد للمستخدم الذي قام بالاسترجاع.
   * @example '1a2b3c4d-5e6f-7890-abcd-ef0123456789'
   */
  @ApiProperty({ description: 'المعرف الفريد للمستخدم الذي قام بالاسترجاع', format: 'uuid', nullable: true })
  restoredBy: string | null;

  /**
   * @description ملاحظات إضافية حول عملية الأرشفة أو الاسترجاع.
   * @example 'تم أرشفة الملف بعد إغلاق المشروع.'
   */
  @ApiProperty({ description: 'ملاحظات إضافية حول عملية الأرشفة أو الاسترجاع', nullable: true })
  notes: string | null;
}
