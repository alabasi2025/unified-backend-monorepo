import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsEnum, IsOptional, IsArray } from 'class-validator';

export class CreateNotificationDTO {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Notification title', example: 'فاتورة جديدة' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message', example: 'تم إنشاء فاتورة جديدة INV-2025-001' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Notification type', enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'], example: 'INFO' })
  @IsEnum(['INFO', 'WARNING', 'ERROR', 'SUCCESS'])
  type: string;

  @ApiProperty({ description: 'Notification category', example: 'BILLING', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Channels to send', enum: ['IN_APP', 'BROWSER', 'EMAIL', 'SMS', 'PUSH', 'WEBHOOK'], isArray: true, example: ['IN_APP', 'EMAIL'] })
  @IsArray()
  @IsEnum(['IN_APP', 'BROWSER', 'EMAIL', 'SMS', 'PUSH', 'WEBHOOK'], { each: true })
  channels: string[];

  @ApiProperty({ description: 'Related entity type', example: 'billing', required: false })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiProperty({ description: 'Related entity ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  entityId?: number;

  @ApiProperty({ description: 'Action URL', example: '/billing/1', required: false })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiProperty({ description: 'Additional data', example: { invoiceNumber: 'INV-2025-001' }, required: false })
  @IsOptional()
  data?: Record<string, any>;
}