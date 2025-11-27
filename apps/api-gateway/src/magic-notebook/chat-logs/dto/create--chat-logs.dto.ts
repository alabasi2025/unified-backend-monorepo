import { IsString, IsNotEmpty, IsUUID, IsArray, ArrayMinSize, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// تعريف نوع الرسالة (Message Role)
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

// تعريف DTO لرسالة واحدة داخل سجل الدردشة
export class MessageDto {
  @ApiProperty({ enum: MessageRole, description: 'دور الرسالة: user, assistant, أو system' })
  @IsEnum(MessageRole)
  role: MessageRole;

  @ApiProperty({ description: 'محتوى الرسالة' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateChatLogsDto {
  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ سجل الدردشة' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'عنوان أو اسم لسجل الدردشة' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [MessageDto], description: 'قائمة رسائل الدردشة' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];

  @ApiProperty({ required: false, description: 'معرف الجلسة (Session ID) إذا كانت جزءًا من جلسة مستمرة' })
  @IsOptional()
  @IsUUID()
  sessionId?: string;
}