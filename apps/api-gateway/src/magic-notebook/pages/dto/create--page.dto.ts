import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({ description: 'عنوان الصفحة', example: 'مقدمة عن NestJS' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'محتوى الصفحة', example: 'هذا هو محتوى الصفحة بتنسيق Markdown' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'معرف دفتر الملاحظات الذي تنتمي إليه الصفحة', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsNotEmpty()
  @IsUUID()
  notebookId: string;

  @ApiProperty({ description: 'هل الصفحة مؤرشفة؟', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiProperty({ description: 'هل الصفحة مفضلة؟', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
