import { IsString, IsOptional, IsBoolean, IsArray, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// افتراض: هذا DTO يستخدم لإنشاء "بحث محفوظ" (Saved Search)
// يتضمن حقولاً لتحديد معايير البحث واسمه ووصفه.

export enum SearchType {
  NOTE = 'note',
  TAG = 'tag',
  USER = 'user',
}

export class CreateSearchDto {
  @ApiProperty({ description: 'اسم فريد للبحث المحفوظ', example: 'بحث عن ملاحظات العمل' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'وصف اختياري للبحث المحفوظ', example: 'جميع الملاحظات المتعلقة بمشروع X' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'نوع الكيان الذي يتم البحث فيه', enum: SearchType, example: SearchType.NOTE })
  @IsEnum(SearchType)
  searchType: SearchType;

  @ApiProperty({ required: false, description: 'نص البحث الرئيسي', example: 'اجتماع الأسبوعي' })
  @IsOptional()
  @IsString()
  queryText?: string;

  @ApiProperty({ required: false, description: 'قائمة بمعرفات العلامات (Tags) المراد البحث عنها', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiProperty({ required: false, description: 'هل البحث عام (Public) أم خاص (Private)', example: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ required: false, description: 'تاريخ البدء للبحث عن الملاحظات التي تم إنشاؤها بعده (ISO 8601)', example: '2023-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, description: 'الحد الأقصى لعدد النتائج', example: 50 })
  @IsOptional()
  @IsNumber()
  maxResults?: number;
}
