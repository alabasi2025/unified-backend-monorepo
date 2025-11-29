import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsDateString, IsOptional, IsString, Min } from 'class-validator';

export class ConsumableUsageDTO {
  @ApiProperty({ description: 'Consumable ID', example: 1 })
  @IsInt()
  consumableId: number;

  @ApiProperty({ description: 'Usage date', example: '2025-01-15' })
  @IsDateString()
  usageDate: string;

  @ApiProperty({ description: 'Quantity dispensed', example: 500.0 })
  @IsNumber()
  @Min(0)
  quantityDispensed: number;

  @ApiProperty({ description: 'Actual consumption', example: 480.0 })
  @IsNumber()
  @Min(0)
  actualConsumption: number;

  @ApiProperty({ description: 'Expected consumption', example: 500.0 })
  @IsNumber()
  @Min(0)
  expectedConsumption: number;

  @ApiProperty({ description: 'Variance', example: -20.0 })
  @IsNumber()
  variance: number;

  @ApiProperty({ description: 'Variance percentage', example: -4.0 })
  @IsNumber()
  variancePercentage: number;

  @ApiProperty({ description: 'Operating hours', example: 20.0 })
  @IsNumber()
  @Min(0)
  operatingHours: number;

  @ApiProperty({ description: 'Waste detected', example: 20.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  wasteDetected?: number;

  @ApiProperty({ description: 'Notes', example: 'تسريب محتمل - يحتاج فحص', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}