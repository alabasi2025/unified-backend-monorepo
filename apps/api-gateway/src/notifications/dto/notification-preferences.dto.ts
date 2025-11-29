import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean, IsOptional, IsString } from 'class-validator';

export class NotificationPreferencesDTO {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Enable in-app notifications', example: true })
  @IsBoolean()
  enableInApp: boolean;

  @ApiProperty({ description: 'Enable browser notifications', example: true })
  @IsBoolean()
  enableBrowser: boolean;

  @ApiProperty({ description: 'Enable email notifications', example: true })
  @IsBoolean()
  enableEmail: boolean;

  @ApiProperty({ description: 'Enable SMS notifications', example: false })
  @IsBoolean()
  enableSms: boolean;

  @ApiProperty({ description: 'Enable push notifications', example: true })
  @IsBoolean()
  enablePush: boolean;

  @ApiProperty({ description: 'Enable webhook notifications', example: false })
  @IsBoolean()
  enableWebhook: boolean;

  @ApiProperty({ description: 'Quiet hours start', example: '22:00', required: false })
  @IsOptional()
  @IsString()
  quietHoursStart?: string;

  @ApiProperty({ description: 'Quiet hours end', example: '08:00', required: false })
  @IsOptional()
  @IsString()
  quietHoursEnd?: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com', required: false })
  @IsOptional()
  @IsString()
  emailAddress?: string;

  @ApiProperty({ description: 'Phone number', example: '+966501234567', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'Webhook URL', example: 'https://api.example.com/webhook', required: false })
  @IsOptional()
  @IsString()
  webhookUrl?: string;
}