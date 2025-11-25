// /home/ubuntu/timeline-module/dto-response.ts
// Response DTO لتمثيل حدث التتبع الزمني عند إرجاعه من API

import { ApiProperty } from '@nestjs/swagger';

export class TimelineEventResponseDto {
  /**
   * المعرف الفريد للحدث
   * @example "a1b2c3d4-e5f6-7890-1234-567890abcdef"
   */
  @ApiProperty({ description: 'المعرف الفريد للحدث' })
  id: string;

  /**
   * نوع الحدث
   * @example "NOTE_CREATED"
   */
  @ApiProperty({ description: 'نوع الحدث' })
  eventType: string;

  /**
   * وصف موجز للحدث
   * @example "تم إنشاء مذكرة جديدة"
   */
  @ApiProperty({ description: 'وصف موجز للحدث' })
  description: string;

  /**
   * معرف الكيان المتأثر بالحدث
   */
  @ApiProperty({ description: 'معرف الكيان المتأثر' })
  entityId: string;

  /**
   * نوع الكيان المتأثر
   * @example "Note"
   */
  @ApiProperty({ description: 'نوع الكيان المتأثر' })
  entityType: string;

  /**
   * بيانات إضافية للحدث
   */
  @ApiProperty({ description: 'بيانات إضافية للحدث', type: () => Object, nullable: true })
  payload: Record<string, any> | null;

  /**
   * معرف المستخدم الذي قام بالحدث
   */
  @ApiProperty({ description: 'معرف المستخدم الذي قام بالحدث', nullable: true })
  userId: string | null;

  /**
   * تاريخ ووقت إنشاء الحدث
   * @example "2025-11-25T10:00:00.000Z"
   */
  @ApiProperty({ description: 'تاريخ ووقت إنشاء الحدث' })
  createdAt: Date;

  constructor(partial: Partial<TimelineEventResponseDto>) {
    Object.assign(this, partial);
  }
}
