// create-recent-activity.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @description: فئة DTO لإنشاء سجل نشاط جديد.
 * تستخدم للتحقق من صحة البيانات الواردة عند إنشاء سجل نشاط.
 */
export class CreateRecentActivityDto {
  /**
   * @description: نوع النشاط (مثال: 'NOTE_CREATED', 'USER_LOGIN').
   */
  @ApiProperty({
    description: 'نوع النشاط',
    example: 'NOTE_CREATED',
  })
  @IsString({ message: 'يجب أن يكون نوع النشاط نصاً' })
  @IsNotEmpty({ message: 'نوع النشاط مطلوب' })
  activityType: string;

  /**
   * @description: وصف مختصر للنشاط.
   */
  @ApiProperty({
    description: 'وصف مختصر للنشاط',
    example: 'تم إنشاء مذكرة جديدة بعنوان "مهمة اليوم"',
  })
  @IsString({ message: 'يجب أن يكون الوصف نصاً' })
  @IsNotEmpty({ message: 'الوصف مطلوب' })
  description: string;

  /**
   * @description: معرف المستخدم الذي قام بالنشاط.
   */
  @ApiProperty({
    description: 'معرف المستخدم الذي قام بالنشاط',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @IsUUID('4', { message: 'يجب أن يكون معرف المستخدم بصيغة UUID صالحة' })
  @IsNotEmpty({ message: 'معرف المستخدم مطلوب' })
  userId: string;

  /**
   * @description: معرف الكيان المرتبط بالنشاط (اختياري).
   */
  @ApiProperty({
    description: 'معرف الكيان المرتبط بالنشاط (مثل: معرف المذكرة)',
    example: 'q7r8s9t0-u1v2-w3x4-y5z6-a7b8c9d0e1f2',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'يجب أن يكون معرف الكيان بصيغة UUID صالحة' })
  entityId?: string;
}
