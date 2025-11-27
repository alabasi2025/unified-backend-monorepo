import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
  Min,
} from 'class-validator';

/**
 * DTO for creating wallet
 * Electronic wallet for customers with balance management
 */
export class CreateWalletDTO {
  @ApiProperty({
    description: 'Customer reference ID',
    example: 1,
  })
  @IsInt()
  customerId: number;

  @ApiProperty({
    description: 'Initial balance',
    example: 0.0,
    required: false,
    default: 0.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number = 0.0;

  @ApiProperty({
    description: 'Wallet currency',
    example: 'SAR',
    required: false,
    default: 'SAR',
  })
  @IsOptional()
  @IsString()
  currency?: string = 'SAR';

  @ApiProperty({
    description: 'Wallet status',
    enum: ['ACTIVE', 'SUSPENDED', 'CLOSED'],
    example: 'ACTIVE',
    required: false,
    default: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'SUSPENDED', 'CLOSED'])
  status?: string = 'ACTIVE';

  @ApiProperty({
    description: 'Wallet type',
    enum: ['PREPAID', 'POSTPAID', 'CREDIT'],
    example: 'PREPAID',
    required: false,
    default: 'PREPAID',
  })
  @IsOptional()
  @IsEnum(['PREPAID', 'POSTPAID', 'CREDIT'])
  walletType?: string = 'PREPAID';

  @ApiProperty({
    description: 'Credit limit for CREDIT wallet type',
    example: 5000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Customer prepaid wallet',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
