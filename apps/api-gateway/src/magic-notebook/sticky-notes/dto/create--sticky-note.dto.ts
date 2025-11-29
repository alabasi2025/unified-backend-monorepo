import { IsString, IsOptional, IsBoolean, IsHexColor, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStickyNoteDto {
  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ الملاحظة', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'عنوان الملاحظة', example: 'مهمة اليوم' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'محتوى الملاحظة', example: 'الرد على البريد الإلكتروني، إنهاء تقرير الربع الأول.' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'لون الملاحظة (اختياري، كود سداسي عشري)', required: false, example: '#FFFF00' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({ description: 'هل الملاحظة مثبتة؟ (اختياري)', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
