import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsBoolean, IsOptional, IsArray, IsNumber } from 'class-validator';

export class IdeaResponseDto {
  @ApiProperty({ description: 'معرف الفكرة الفريد' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'تاريخ إنشاء الفكرة' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث للفكرة' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: 'عنوان الفكرة' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'محتوى الفكرة أو وصفها' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ الفكرة' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'حالة الأرشفة للفكرة', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiProperty({ description: 'علامات (Tags) مرتبطة بالفكرة', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'مستوى الأهمية أو الأولوية', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  priority?: number;
}
