import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString, IsUUID } from 'class-validator';

// Base DTO (Inferred for UpdateChatLogDto to extend)
export class CreateChatLogDto {
  @ApiProperty({ description: 'The ID of the chat session this log belongs to' })
  @IsUUID()
  chatId: string;

  @ApiProperty({ description: 'The ID of the sender (user or system)' })
  @IsString()
  senderId: string;

  @ApiProperty({ description: 'The content of the message' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Flag indicating if the message has been read', required: false })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({ description: 'Optional metadata for the log entry', required: false })
  @IsOptional()
  @IsString()
  metadata?: string;
}

// Final Update DTO
export class UpdateChatLogDto extends PartialType(CreateChatLogDto) {}
