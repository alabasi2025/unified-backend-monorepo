import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsBoolean, IsNumber } from 'class-validator';

export class PagesResponseDto {
  @ApiProperty({ description: 'معرف الصفحة الفريد' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'معرف الدفتر الذي تنتمي إليه الصفحة' })
  @IsNumber()
  notebookId: number;

  @ApiProperty({ description: 'عنوان الصفحة' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'محتوى الصفحة (نص Markdown)' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'حالة أرشفة الصفحة' })
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({ description: 'تاريخ إنشاء الصفحة' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث للصفحة' })
  @IsDate()
  updatedAt: Date;
}
