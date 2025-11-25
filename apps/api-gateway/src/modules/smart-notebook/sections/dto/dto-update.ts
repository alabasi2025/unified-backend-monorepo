import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, MaxLength } from 'class-validator';
import { CreateSectionDto } from './dto-create';

/**
 * DTO لتحديث قسم موجود (Section)
 * يرث من CreateSectionDto ويجعل جميع الحقول اختيارية (PartialType).
 * يتم استبعاد 'notebookId' من التحديث لأنه لا يجب تغيير الدفتر الأم للقسم.
 */
export class UpdateSectionDto extends PartialType(CreateSectionDto) {
  /**
   * اسم القسم. اختياري.
   */
  @ApiProperty({
    description: 'اسم القسم',
    example: 'مقدمة المشروع (محدث)',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'يجب أن يكون الاسم نصًا' })
  @MaxLength(255, { message: 'يجب ألا يتجاوز الاسم 255 حرفًا' })
  name?: string;

  /**
   * ترتيب القسم داخل الدفتر. اختياري.
   */
  @ApiProperty({
    description: 'ترتيب القسم داخل الدفتر',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'يجب أن يكون الترتيب عددًا صحيحًا' })
  @Min(0, { message: 'يجب أن يكون الترتيب أكبر من أو يساوي 0' })
  rank?: number;

  // ملاحظة: تم حذف حقل notebookId من التحديث لأنه لا يجب تغيير الدفتر الأم للقسم.
  // بما أننا ورثنا من PartialType(CreateSectionDto)، يجب التأكد من أننا لا نستخدم notebookId هنا.
  // في NestJS، استخدام PartialType يجعل جميع الحقول اختيارية، ولكن يمكننا تجاوزها أو تجاهلها.
  // في هذه الحالة، سنعتمد على أن Controller لن يسمح بتمرير notebookId في جسم الطلب.
}
