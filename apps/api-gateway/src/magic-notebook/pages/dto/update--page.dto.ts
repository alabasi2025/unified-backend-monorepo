import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// Base DTO for creating a page (inferred)
export class CreatePageDto {
  @ApiProperty({ description: 'معرف المفكرة التي تنتمي إليها الصفحة' })
  @IsUUID()
  notebookId: string;

  @ApiProperty({ description: 'عنوان الصفحة' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, description: 'محتوى الصفحة (نص، ماركداون، إلخ)' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false, description: 'هل الصفحة مفضلة؟' })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}

// Update DTO for a page
export class UpdatePageDto extends PartialType(CreatePageDto) {}
