import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

// DTO الأساسي الذي سيتم استخدامه لإنشاء Update DTO
// نفترض حقولاً منطقية لـ "timeline" مثل العنوان، الوصف، وتاريخ الحدث.
export class CreateTimelineDto {
  @ApiProperty({ description: 'عنوان الحدث في الجدول الزمني' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, description: 'وصف مفصل للحدث' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'تاريخ ووقت وقوع الحدث (ISO 8601)' })
  @IsDateString()
  eventDate: Date;

  @ApiProperty({ required: false, description: 'هل تم إكمال هذا الحدث؟' })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

// DTO المطلوب: UpdateTimelineDto
// يستخدم PartialType لجعل جميع حقول CreateTimelineDto اختيارية
export class UpdateTimelineDto extends PartialType(CreateTimelineDto) {}
