import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class TimelineResponseDto {
  @ApiProperty({ description: 'معرف العنصر في الجدول الزمني' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ العنصر' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'نوع الحدث في الجدول الزمني (مثل: note, task, event)' })
  @IsString()
  eventType: string;

  @ApiProperty({ description: 'عنوان أو وصف موجز للحدث' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'محتوى الحدث أو تفاصيله', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'التاريخ والوقت المرتبط بالحدث' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ description: 'تاريخ إنشاء العنصر' })
  @IsDateString()
  createdAt: string;

  @ApiProperty({ description: 'تاريخ آخر تحديث للعنصر' })
  @IsDateString()
  updatedAt: string;
}
