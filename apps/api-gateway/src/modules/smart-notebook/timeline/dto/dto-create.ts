// /home/ubuntu/timeline-module/dto-create.ts
// Create DTO لإنشاء حدث جديد في التتبع الزمني

import { IsString, IsNotEmpty, IsOptional, IsObject, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimelineEventDto {
  /**
   * نوع الحدث (مثال: NOTE_CREATED, USER_LOGIN)
   * @example "NOTE_CREATED"
   */
  @ApiProperty({ description: 'نوع الحدث', example: 'NOTE_CREATED' })
  @IsString({ message: 'يجب أن يكون نوع الحدث نصًا' })
  @IsNotEmpty({ message: 'نوع الحدث مطلوب' })
  eventType: string;

  /**
   * وصف موجز للحدث
   * @example "تم إنشاء مذكرة جديدة بعنوان 'مهمة اليوم'"
   */
  @ApiProperty({ description: 'وصف موجز للحدث', example: "تم إنشاء مذكرة جديدة" })
  @IsString({ message: 'يجب أن يكون الوصف نصًا' })
  @IsNotEmpty({ message: 'الوصف مطلوب' })
  description: string;

  /**
   * معرف الكيان المتأثر بالحدث (مثل معرف المذكرة)
   * @example "a1b2c3d4-e5f6-7890-1234-567890abcdef"
   */
  @ApiProperty({ description: 'معرف الكيان المتأثر' })
  @IsString({ message: 'يجب أن يكون معرف الكيان نصًا' })
  @IsNotEmpty({ message: 'معرف الكيان مطلوب' })
  entityId: string;

  /**
   * نوع الكيان المتأثر (مثال: Note, User)
   * @example "Note"
   */
  @ApiProperty({ description: 'نوع الكيان المتأثر', example: 'Note' })
  @IsString({ message: 'يجب أن يكون نوع الكيان نصًا' })
  @IsNotEmpty({ message: 'نوع الكيان مطلوب' })
  entityType: string;

  /**
   * بيانات إضافية للحدث (اختياري)
   */
  @ApiProperty({ description: 'بيانات إضافية للحدث', required: false, type: 'object' })
  @IsOptional()
  @IsObject({ message: 'يجب أن تكون البيانات الإضافية كائنًا' })
  payload?: Record<string, any>;

  /**
   * معرف المستخدم الذي قام بالحدث (اختياري، يمكن أن يكون النظام هو الفاعل)
   */
  @ApiProperty({ description: 'معرف المستخدم الذي قام بالحدث', required: false })
  @IsOptional()
  @IsString({ message: 'يجب أن يكون معرف المستخدم نصًا' })
  userId?: string;
}
