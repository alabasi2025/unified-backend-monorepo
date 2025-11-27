import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for billing API responses
 * Returns formatted billing data with customer information
 */
export class BillingResponseDTO {
  @ApiProperty({
    description: 'Billing record ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Customer reference ID',
    example: 1,
  })
  customerId: number;

  @ApiProperty({
    description: 'Customer name',
    example: 'شركة الأمل التجارية',
  })
  customerName: string;

  @ApiProperty({
    description: 'Billing type',
    example: 'SERVICE',
  })
  billingType: string;

  @ApiProperty({
    description: 'Invoice number',
    example: 'INV-2025-001',
  })
  invoiceNumber: string;

  @ApiProperty({
    description: 'Billing amount before tax',
    example: 1000.0,
  })
  amount: number;

  @ApiProperty({
    description: 'Tax amount',
    example: 150.0,
  })
  taxAmount: number;

  @ApiProperty({
    description: 'Discount amount',
    example: 50.0,
  })
  discountAmount: number;

  @ApiProperty({
    description: 'Total amount after tax and discount',
    example: 1100.0,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Billing period start date',
    example: '2025-01-01T00:00:00.000Z',
  })
  periodStart: Date;

  @ApiProperty({
    description: 'Billing period end date',
    example: '2025-01-31T23:59:59.999Z',
  })
  periodEnd: Date;

  @ApiProperty({
    description: 'Due date for payment',
    example: '2025-02-15T23:59:59.999Z',
  })
  dueDate: Date;

  @ApiProperty({
    description: 'Billing status',
    example: 'PENDING',
  })
  status: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Monthly service billing',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Project reference ID',
    example: 1,
    required: false,
  })
  projectId?: number;

  @ApiProperty({
    description: 'Unit reference ID',
    example: 1,
    required: false,
  })
  unitId?: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-15T14:30:00.000Z',
  })
  updatedAt: Date;
}
