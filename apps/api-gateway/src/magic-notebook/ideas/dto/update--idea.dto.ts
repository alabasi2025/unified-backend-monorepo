import { PartialType } from '@nestjs/swagger';
import { CreateIdeaDto } from './create-idea.dto';

// ملاحظة: يتم افتراض وجود ملف create-idea.dto.ts يحتوي على CreateIdeaDto
// لغرض توليد كود Update DTO بشكل صحيح.

export class UpdateIdeaDto extends PartialType(CreateIdeaDto) {}

// الكود الافتراضي لـ CreateIdeaDto (للتوضيح فقط، لا يتم تضمينه في الملف النهائي):
/*
import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIdeaDto {
  @ApiProperty({ description: 'عنوان الفكرة', example: 'تطبيق جديد للملاحظات' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'وصف مفصل للفكرة', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'حالة الفكرة (قيد التنفيذ، مكتملة، إلخ)', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'هل الفكرة مؤرشفة؟', required: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiProperty({ description: 'علامات أو تصنيفات للفكرة', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
*/