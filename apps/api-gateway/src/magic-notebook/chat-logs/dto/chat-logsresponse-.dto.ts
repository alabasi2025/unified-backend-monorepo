import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsUUID, IsBoolean, IsOptional, IsArray } from 'class-validator';

// تعريف واجهة للرسالة الفردية داخل سجل الدردشة
class ChatMessage {
  @ApiProperty({ description: 'محتوى الرسالة' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'مرسل الرسالة (مثل: user, ai)' })
  @IsString()
  sender: string;

  @ApiProperty({ description: 'وقت إرسال الرسالة' })
  @IsDate()
  timestamp: Date;
}

export class ChatLogsResponseDto {
  @ApiProperty({ description: 'المعرف الفريد لسجل الدردشة' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'المعرف الفريد للمستخدم' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'عنوان جلسة الدردشة' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'سجل الرسائل في الجلسة', type: [ChatMessage] })
  @IsArray()
  messages: ChatMessage[];

  @ApiProperty({ description: 'حالة الأرشفة للجلسة' })
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({ description: 'تاريخ إنشاء سجل الدردشة' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث لسجل الدردشة' })
  @IsDate()
  updatedAt: Date;
}