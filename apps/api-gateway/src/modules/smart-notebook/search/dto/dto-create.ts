// /home/ubuntu/search-module/dto-create.ts
// Create DTO لطلب البحث المتقدم (Advanced Search Request)

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsInt, Min, Max } from 'class-validator';

// تعريف أنواع الكيانات التي يمكن البحث فيها
export enum SearchableEntityType {
  NOTEBOOK = 'notebook',
  NOTE = 'note',
  TAG = 'tag',
  ALL = 'all',
}

export class CreateSearchDto {
  // نص البحث الرئيسي
  @ApiProperty({
    description: 'نص البحث الرئيسي',
    example: 'ملاحظات الاجتماع',
  })
  @IsString({ message: 'يجب أن يكون نص البحث سلسلة نصية' })
  query: string;

  // أنواع الكيانات المراد البحث فيها (دفاتر، ملاحظات، وسوم)
  @ApiProperty({
    description: 'أنواع الكيانات المراد البحث فيها',
    enum: SearchableEntityType,
    isArray: true,
    required: false,
    default: [SearchableEntityType.ALL],
  })
  @IsOptional()
  @IsArray({ message: 'يجب أن تكون أنواع الكيانات مصفوفة' })
  @IsEnum(SearchableEntityType, { each: true, message: 'قيمة غير صالحة لنوع الكيان' })
  entityTypes?: SearchableEntityType[];

  // معرفات المستخدمين أو المالكين (للبحث المشترك)
  @ApiProperty({
    description: 'معرفات المستخدمين أو المالكين للبحث المشترك',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'يجب أن تكون معرفات المالكين مصفوفة' })
  @IsString({ each: true, message: 'يجب أن يكون كل معرف مالك سلسلة نصية' })
  ownerIds?: string[];

  // نطاق البحث الزمني (بالأيام الماضية)
  @ApiProperty({
    description: 'نطاق البحث الزمني (بالأيام الماضية). 0 تعني بلا قيود.',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'يجب أن يكون نطاق البحث الزمني عددًا صحيحًا' })
  @Min(0, { message: 'يجب أن يكون نطاق البحث الزمني أكبر من أو يساوي 0' })
  timeRangeDays?: number;

  // عدد النتائج في الصفحة
  @ApiProperty({
    description: 'عدد النتائج في الصفحة',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'يجب أن يكون عدد النتائج عددًا صحيحًا' })
  @Min(1, { message: 'يجب أن يكون عدد النتائج أكبر من 0' })
  @Max(100, { message: 'الحد الأقصى لعدد النتائج هو 100' })
  limit?: number = 10;

  // رقم الصفحة
  @ApiProperty({
    description: 'رقم الصفحة',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'يجب أن يكون رقم الصفحة عددًا صحيحًا' })
  @Min(1, { message: 'يجب أن يكون رقم الصفحة أكبر من 0' })
  page?: number = 1;
}
