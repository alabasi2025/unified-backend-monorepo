import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
  IsInt,
} from 'class-validator';

/**
 * DTO for creating billing records
 * Used for invoice generation and billing management
 */
export class CreateBillingDTO {
  @ApiProperty({
    description: 'Customer reference ID',
    example: 1,
  })
  @IsInt()
  customerId: number;

  @ApiProperty({
    description: 'Billing type',
    enum: ['METER', 'SERVICE', 'PRODUCT', 'SUBSCRIPTION'],
    example: 'SERVICE',
  })
  @IsEnum(['METER', 'SERVICE', 'PRODUCT', 'SUBSCRIPTION'])
  billingType: string;

  @ApiProperty({
    description: 'Invoice number',
    example: 'INV-2025-001',
  })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    description: 'Billing amount before tax',
    example: 1000.0,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Tax amount',
    example: 150.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiProperty({
    description: 'Discount amount',
    example: 50.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiProperty({
    description: 'Total amount after tax and discount',
    example: 1100.0,
  })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: 'Billing period start date',
    example: '2025-01-01',
  })
  @IsDateString()
  periodStart: string;

  @ApiProperty({
    description: 'Billing period end date',
    example: '2025-01-31',
  })
  @IsDateString()
  periodEnd: string;

  @ApiProperty({
    description: 'Due date for payment',
    example: '2025-02-15',
  })
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    description: 'Billing status',
    enum: ['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
    example: 'PENDING',
    required: false,
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'])
  status?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Monthly service billing',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Project reference ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  projectId?: number;

  @ApiProperty({
    description: 'Unit reference ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  unitId?: number;
}
