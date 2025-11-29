import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, IsUUID } from 'class-validator';

// DTO الأساسي (Create DTO)
export class CreateSectionDto {
  @ApiProperty({ description: 'معرف دفتر الملاحظات الذي تنتمي إليه هذه القسم' })
  @IsUUID()
  notebookId: string;

  @ApiProperty({ description: 'عنوان القسم' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, description: 'وصف اختياري للقسم' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ترتيب القسم داخل دفتر الملاحظات', minimum: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ required: false, description: 'لون القسم (اختياري)' })
  @IsOptional()
  @IsString()
  color?: string;
}

// DTO التحديث (Update DTO)
export class UpdateSectionDto extends PartialType(CreateSectionDto) {}