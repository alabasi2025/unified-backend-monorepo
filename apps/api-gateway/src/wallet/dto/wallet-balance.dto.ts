import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for wallet balance queries and responses
 * Returns current balance and wallet information
 */
export class WalletBalanceDTO {
  @ApiProperty({
    description: 'Wallet ID',
    example: 1,
  })
  walletId: number;

  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  customerId: number;

  @ApiProperty({
    description: 'Customer name',
    example: 'أحمد محمد',
  })
  customerName: string;

  @ApiProperty({
    description: 'Current balance',
    example: 1500.0,
  })
  currentBalance: number;

  @ApiProperty({
    description: 'Available balance (after pending transactions)',
    example: 1450.0,
  })
  availableBalance: number;

  @ApiProperty({
    description: 'Pending amount',
    example: 50.0,
  })
  pendingAmount: number;

  @ApiProperty({
    description: 'Wallet currency',
    example: 'SAR',
  })
  currency: string;

  @ApiProperty({
    description: 'Wallet status',
    example: 'ACTIVE',
  })
  status: string;

  @ApiProperty({
    description: 'Wallet type',
    example: 'PREPAID',
  })
  walletType: string;

  @ApiProperty({
    description: 'Credit limit (for CREDIT type)',
    example: 5000.0,
    required: false,
  })
  creditLimit?: number;

  @ApiProperty({
    description: 'Total deposits',
    example: 2000.0,
  })
  totalDeposits: number;

  @ApiProperty({
    description: 'Total withdrawals',
    example: 500.0,
  })
  totalWithdrawals: number;

  @ApiProperty({
    description: 'Last transaction date',
    example: '2025-01-15T14:30:00.000Z',
  })
  lastTransactionDate: Date;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-01-01T10:00:00.000Z',
  })
  createdAt: Date;
}
