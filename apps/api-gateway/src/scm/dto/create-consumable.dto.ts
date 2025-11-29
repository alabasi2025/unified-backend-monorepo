import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateConsumableDTO {
  @ApiProperty({ description: 'Consumable name', example: 'ديزل' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Consumable code', example: 'DIESEL-001' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Unit of measure', example: 'لتر' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Asset ID (linked asset)', example: 1 })
  @IsInt()
  assetId: number;

  @ApiProperty({ description: 'Expected consumption rate per hour', example: 25.0 })
  @IsNumber()
  @Min(0)
  expectedConsumptionRate: number;

  @ApiProperty({ description: 'Threshold variance percentage', example: 10.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  thresholdVariance?: number;

  @ApiProperty({ description: 'Current stock level', example: 5000.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentStock?: number;

  @ApiProperty({ description: 'Unit cost', example: 2.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitCost?: number;
}