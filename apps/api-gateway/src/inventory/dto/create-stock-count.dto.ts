import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateStockCountDTO {
  @ApiProperty({ description: 'Warehouse ID', example: 1 })
  @IsInt()
  warehouseId: number;

  @ApiProperty({ description: 'Count date', example: '2025-01-15' })
  @IsDateString()
  countDate: string;

  @ApiProperty({ description: 'Count type', enum: ['FULL', 'PARTIAL', 'CYCLE'], example: 'FULL' })
  @IsEnum(['FULL', 'PARTIAL', 'CYCLE'])
  countType: string;

  @ApiProperty({ description: 'Status', enum: ['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], example: 'DRAFT', required: false })
  @IsOptional()
  @IsEnum(['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: string;

  @ApiProperty({ description: 'Notes', example: 'Monthly stock count', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Counted by user ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  countedBy?: number;
}