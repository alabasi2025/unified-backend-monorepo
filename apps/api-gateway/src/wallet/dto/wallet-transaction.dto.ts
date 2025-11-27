import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsEnum,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

/**
 * DTO for wallet transactions
 * Records all wallet credit/debit operations
 */
export class WalletTransactionDTO {
  @ApiProperty({
    description: 'Wallet ID',
    example: 1,
  })
  @IsInt()
  walletId: number;

  @ApiProperty({
    description: 'Transaction type',
    enum: ['DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'REFUND', 'ADJUSTMENT'],
    example: 'DEPOSIT',
  })
  @IsEnum(['DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'REFUND', 'ADJUSTMENT'])
  transactionType: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 100.0,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Balance before transaction',
    example: 500.0,
  })
  @IsNumber()
  balanceBefore: number;

  @ApiProperty({
    description: 'Balance after transaction',
    example: 600.0,
  })
  @IsNumber()
  balanceAfter: number;

  @ApiProperty({
    description: 'Transaction reference number',
    example: 'TXN-2025-001',
  })
  @IsString()
  referenceNumber: string;

  @ApiProperty({
    description: 'Payment gateway reference',
    example: 'PG-REF-123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  gatewayReference?: string;

  @ApiProperty({
    description: 'Related billing ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  billingId?: number;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Customer deposit via bank transfer',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Transaction status',
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'],
    example: 'COMPLETED',
    required: false,
    default: 'PENDING',
  })
  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'])
  status?: string = 'PENDING';

  @ApiProperty({
    description: 'Additional metadata (JSON)',
    example: { method: 'bank_transfer', bank: 'Al Rajhi' },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
