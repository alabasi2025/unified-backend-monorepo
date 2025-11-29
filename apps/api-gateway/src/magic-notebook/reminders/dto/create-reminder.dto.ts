import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReminderDto {
  @ApiProperty({ description: 'ID of the page this reminder is for' })
  @IsString()
  @IsNotEmpty()
  pageId: string;

  @ApiProperty({ description: 'Reminder title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Reminder description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Reminder date and time' })
  @IsDateString()
  @IsNotEmpty()
  reminderDate: string;

  @ApiPropertyOptional({ description: 'Is the reminder completed?', default: false })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @ApiPropertyOptional({ description: 'User ID who created the reminder' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
