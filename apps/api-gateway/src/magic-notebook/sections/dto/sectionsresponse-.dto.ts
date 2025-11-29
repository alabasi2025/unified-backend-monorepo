import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, IsBoolean } from 'class-validator';

export class SectionsResponseDto {
  @ApiProperty({ description: 'معرف القسم الفريد' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'معرف المفكرة الأم' })
  @IsString()
  notebookId: string;

  @ApiProperty({ description: 'عنوان القسم' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'ترتيب القسم داخل المفكرة' })
  @IsNumber()
  order: number;

  @ApiProperty({ description: 'حالة الأرشفة للقسم' })
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({ description: 'تاريخ إنشاء القسم' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث للقسم' })
  @IsDate()
  updatedAt: Date;
}
