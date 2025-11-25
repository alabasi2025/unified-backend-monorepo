// dto-response.ts

import { ApiProperty } from '@nestjs/swagger';

/**
 * @class NotebookResponseDto
 * @description يمثل هيكل الاستجابة لدفتر ملاحظات.
 */
export class NotebookResponseDto {
  @ApiProperty({
    description: 'المعرف الفريد لدفتر الملاحظات.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'عنوان دفتر الملاحظات.',
    example: 'دفتر الملاحظات الشخصي',
  })
  title: string;

  @ApiProperty({
    description: 'وصف دفتر الملاحظات.',
    example: 'دفتر لتدوين الملاحظات اليومية والمهام.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'معرف المستخدم المالك للدفتر.',
    example: 'user-uuid-12345',
  })
  ownerId: string;

  @ApiProperty({
    description: 'حالة الدفتر (مثلاً: active, archived).',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'هل الدفتر مشترك مع مستخدمين آخرين؟',
    example: false,
  })
  isShared: boolean;

  @ApiProperty({
    description: 'معرف الدفتر الأب (إذا كان دفتراً فرعياً).',
    example: 'parent-uuid-67890',
    nullable: true,
  })
  parentId: string | null;

  @ApiProperty({
    description: 'تاريخ إنشاء الدفتر.',
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'تاريخ آخر تحديث للدفتر.',
    example: new Date().toISOString(),
  })
  updatedAt: Date;
}
