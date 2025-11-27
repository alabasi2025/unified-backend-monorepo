import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ description: 'معرف الدفتر الذي تنتمي إليه الوحدة' })
  @IsString()
  @IsNotEmpty()
  notebookId: string;

  @ApiProperty({ description: 'عنوان الوحدة' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'ترتيب عرض الوحدة داخل الدفتر', minimum: 1 })
  @IsNumber()
  @Min(1)
  order: number;

  @ApiProperty({ description: 'هل الوحدة مؤرشفة؟', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
