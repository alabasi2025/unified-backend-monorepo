import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class StickyNotesResponseDto {
  @ApiProperty({ description: 'معرف الملاحظة اللاصقة', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ الملاحظة', example: 'user-id-123' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'عنوان الملاحظة', example: 'مهمة اليوم' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'محتوى الملاحظة', example: 'يجب إنهاء تقرير الربع الأول.' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'لون الملاحظة', example: '#FFFF00' })
  @IsString()
  color: string;

  @ApiProperty({ description: 'ترتيب الملاحظة', example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ description: 'هل الملاحظة مؤرشفة؟', example: false })
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({ description: 'تاريخ ووقت إنشاء الملاحظة', example: '2025-11-27T10:00:00.000Z' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ ووقت آخر تحديث للملاحظة', example: '2025-11-27T10:30:00.000Z' })
  @IsDateString()
  updatedAt: Date;
}
