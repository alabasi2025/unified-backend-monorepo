import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotebookDto {
  @ApiProperty({
    description: 'معرف المستخدم الذي ينتمي إليه الدفتر',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsNotEmpty({ message: 'معرف المستخدم مطلوب' })
  @IsUUID('4', { message: 'معرف المستخدم يجب أن يكون UUID صالحًا' })
  userId: string;

  @ApiProperty({
    description: 'عنوان الدفتر',
    example: 'دفتر الملاحظات الرئيسي',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  @IsString({ message: 'العنوان يجب أن يكون نصًا' })
  @MaxLength(255, { message: 'يجب ألا يتجاوز العنوان 255 حرفًا' })
  title: string;

  @ApiProperty({
    description: 'وصف اختياري للدفتر',
    example: 'دفتر خاص بمشاريع العمل',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'الوصف يجب أن يكون نصًا' })
  description?: string;

  @ApiProperty({
    description: 'حالة أرشفة الدفتر',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'حالة الأرشفة يجب أن تكون قيمة منطقية' })
  isArchived?: boolean;
}
