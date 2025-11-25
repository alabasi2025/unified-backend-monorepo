// dto-update.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsUUID, IsBoolean } from 'class-validator';
import { CreateNotebookDto } from './dto-create';

/**
 * @class UpdateNotebookDto
 * @description يمثل البيانات الاختيارية لتحديث دفتر ملاحظات موجود.
 * يرث من CreateNotebookDto لجلب الخصائص المشتركة.
 */
export class UpdateNotebookDto extends CreateNotebookDto {
  @ApiProperty({
    description: 'عنوان دفتر الملاحظات.',
    example: 'دفتر الملاحظات المحدث',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'العنوان يجب أن يكون نصًا.' })
  @MaxLength(255, { message: 'يجب ألا يتجاوز طول العنوان 255 حرفًا.' })
  title?: string;

  @ApiProperty({
    description: 'وصف اختياري لدفتر الملاحظات.',
    example: 'وصف جديد ومحدث.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'الوصف يجب أن يكون نصًا.' })
  description?: string;

  @ApiProperty({
    description: 'معرف الدفتر الأب الجديد (إذا تم نقله).',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'معرف الدفتر الأب يجب أن يكون UUID صالحًا.' })
  parentId?: string | null; // يمكن أن يكون null لنقله إلى الجذر

  @ApiProperty({
    description: 'حالة المشاركة للدفتر.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'حالة المشاركة يجب أن تكون قيمة منطقية.' })
  isShared?: boolean;
}
