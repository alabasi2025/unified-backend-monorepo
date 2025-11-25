import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateNotebookDto {
  @ApiProperty({ description: 'عنوان الدفتر', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'الوصف', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'الأيقونة', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'اللون', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'الوسوم', required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
