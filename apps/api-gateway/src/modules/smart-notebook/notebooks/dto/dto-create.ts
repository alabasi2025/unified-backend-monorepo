// dto-create.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';

/**
 * @class CreateNotebookDto
 * @description يمثل البيانات المطلوبة لإنشاء دفتر ملاحظات جديد.
 */
export class CreateNotebookDto {
  @ApiProperty({
    description: 'عنوان دفتر الملاحظات. يجب أن يكون فريدًا لكل مستخدم.',
    example: 'دفتر الملاحظات الشخصي',
    maxLength: 255,
  })
  @IsString({ message: 'العنوان يجب أن يكون نصًا.' })
  @IsNotEmpty({ message: 'العنوان مطلوب.' })
  @MaxLength(255, { message: 'يجب ألا يتجاوز طول العنوان 255 حرفًا.' })
  title: string;

  @ApiProperty({
    description: 'وصف اختياري لدفتر الملاحظات.',
    example: 'دفتر لتدوين الملاحظات اليومية والمهام.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'الوصف يجب أن يكون نصًا.' })
  description?: string;

  @ApiProperty({
    description: 'معرف الدفتر الأب (إذا كان دفتراً فرعياً).',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'معرف الدفتر الأب يجب أن يكون UUID صالحًا.' })
  parentId?: string;
}
