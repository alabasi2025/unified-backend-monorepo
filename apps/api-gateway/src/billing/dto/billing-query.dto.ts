import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';

/**
 * DTO for billing queries with filters and pagination
 */
export class BillingQueryDTO {
  @ApiProperty({
    description: 'Page number (1-indexed)',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by customer ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  customerId?: number;

  @ApiProperty({
    description: 'Filter by billing type',
    enum: ['METER', 'SERVICE', 'PRODUCT', 'SUBSCRIPTION'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['METER', 'SERVICE', 'PRODUCT', 'SUBSCRIPTION'])
  billingType?: string;

  @ApiProperty({
    description: 'Filter by status',
    enum: ['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'])
  status?: string;

  @ApiProperty({
    description: 'Filter by period start date (from)',
    example: '2025-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  periodStartFrom?: string;

  @ApiProperty({
    description: 'Filter by period start date (to)',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  periodStartTo?: string;

  @ApiProperty({
    description: 'Filter by project ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  projectId?: number;

  @ApiProperty({
    description: 'Filter by unit ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  unitId?: number;

  @ApiProperty({
    description: 'Sort field',
    enum: ['createdAt', 'dueDate', 'totalAmount', 'invoiceNumber'],
    required: false,
    default: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['createdAt', 'dueDate', 'totalAmount', 'invoiceNumber'])
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    required: false,
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string = 'desc';
}
