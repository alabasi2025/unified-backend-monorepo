import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

/**
 * DTO لإنشاء قسم جديد (Section)
 * يحتوي على البيانات المطلوبة لإنشاء قسم جديد داخل دفتر ملاحظات محدد.
 */
export class CreateSectionDto {
  /**
   * اسم القسم. مطلوب.
   */
  @ApiProperty({
    description: 'اسم القسم',
    example: 'مقدمة المشروع',
    maxLength: 255,
  })
  @IsString({ message: 'يجب أن يكون الاسم نصًا' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  @MaxLength(255, { message: 'يجب ألا يتجاوز الاسم 255 حرفًا' })
  name: string;

  /**
   * معرف الدفتر (Notebook ID) الذي ينتمي إليه القسم. مطلوب.
   */
  @ApiProperty({
    description: 'معرف الدفتر (UUID)',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID('4', { message: 'يجب أن يكون معرف الدفتر بصيغة UUID صالحة' })
  @IsNotEmpty({ message: 'معرف الدفتر مطلوب' })
  notebookId: string;

  /**
   * ترتيب القسم داخل الدفتر. اختياري.
   * إذا لم يتم تحديده، سيتم تعيينه افتراضيًا إلى 0 في قاعدة البيانات.
   */
  @ApiProperty({
    description: 'ترتيب القسم داخل الدفتر',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'يجب أن يكون الترتيب عددًا صحيحًا' })
  @Min(0, { message: 'يجب أن يكون الترتيب أكبر من أو يساوي 0' })
  rank?: number;
}
