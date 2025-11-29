import { IsString, IsOptional, IsBoolean, IsDateString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimelineDto {
  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ السجل', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'عنوان سجل الجدول الزمني', example: 'اجتماع الفريق الأسبوعي' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'محتوى أو وصف السجل', required: false, example: 'مناقشة خطة الربع الرابع والميزانية.' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'تاريخ ووقت الحدث في الجدول الزمني (صيغة ISO 8601)', example: '2025-11-27T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  eventDate: string;

  @ApiProperty({ description: 'هل السجل عام أم خاص', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
