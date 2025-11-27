import { PartialType } from '@nestjs/swagger';
import { CreateWalletDTO } from './create-wallet.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

/**
 * DTO for updating wallet
 * Allows partial updates with balance adjustment
 */
export class UpdateWalletDTO extends PartialType(CreateWalletDTO) {
  @ApiProperty({
    description: 'Balance adjustment amount (positive for credit, negative for debit)',
    example: 100.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  balanceAdjustment?: number;
}
