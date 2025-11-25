// response-recent-activity.dto.ts

import { ApiProperty } from '@nestjs/swagger';

/**
 * @description: فئة DTO للاستجابة (Response DTO) لسجل النشاط.
 * تستخدم لتحديد شكل البيانات التي يتم إرجاعها من واجهات برمجة التطبيقات.
 */
export class RecentActivityResponseDto {
  /**
   * @description: معرف السجل.
   */
  @ApiProperty({
    description: 'معرف السجل',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  id: string;

  /**
   * @description: نوع النشاط.
   */
  @ApiProperty({
    description: 'نوع النشاط',
    example: 'NOTE_CREATED',
  })
  activityType: string;

  /**
   * @description: وصف مختصر للنشاط.
   */
  @ApiProperty({
    description: 'وصف مختصر للنشاط',
    example: 'تم إنشاء مذكرة جديدة بعنوان "مهمة اليوم"',
  })
  description: string;

  /**
   * @description: معرف المستخدم الذي قام بالنشاط.
   */
  @ApiProperty({
    description: 'معرف المستخدم الذي قام بالنشاط',
    example: 'u1v2w3x4-y5z6-a7b8-c9d0-e1f2g3h4i5j6',
  })
  userId: string;

  /**
   * @description: معرف الكيان المرتبط بالنشاط (اختياري).
   */
  @ApiProperty({
    description: 'معرف الكيان المرتبط بالنشاط',
    example: 'q7r8s9t0-u1v2-w3x4-y5z6-a7b8c9d0e1f2',
    nullable: true,
  })
  entityId: string | null;

  /**
   * @description: وقت إنشاء السجل.
   */
  @ApiProperty({
    description: 'وقت إنشاء السجل',
    example: '2025-11-25T10:00:00.000Z',
  })
  createdAt: Date;

  // حقل إضافي لتمثيل الإحصائيات المجمعة (غير موجود في نموذج Prisma، ولكنه مفيد للوحة التحكم)
  /**
   * @description: عدد الأنشطة المماثلة (لأغراض الإحصائيات).
   */
  @ApiProperty({
    description: 'عدد الأنشطة المماثلة (لأغراض الإحصائيات)',
    example: 5,
    type: Number,
    required: false,
  })
  count?: number;
}
