import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateAssetDTO {
  @ApiProperty({ description: 'Asset name', example: 'مولد كهربائي 500 كيلو وات' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Asset code', example: 'GEN-001' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Asset category', enum: ['EQUIPMENT', 'VEHICLE', 'BUILDING', 'FURNITURE', 'IT'], example: 'EQUIPMENT' })
  @IsEnum(['EQUIPMENT', 'VEHICLE', 'BUILDING', 'FURNITURE', 'IT'])
  category: string;

  @ApiProperty({ description: 'Purchase date', example: '2024-01-01' })
  @IsDateString()
  purchaseDate: string;

  @ApiProperty({ description: 'Purchase cost', example: 250000.0 })
  @IsNumber()
  @Min(0)
  purchaseCost: number;

  @ApiProperty({ description: 'Useful life in years', example: 10 })
  @IsInt()
  @Min(1)
  usefulLife: number;

  @ApiProperty({ description: 'Salvage value', example: 25000.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salvageValue?: number;

  @ApiProperty({ description: 'Depreciation method', enum: ['STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION'], example: 'STRAIGHT_LINE', required: false })
  @IsOptional()
  @IsEnum(['STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION'])
  depreciationMethod?: string;

  @ApiProperty({ description: 'Location', example: 'المستودع الرئيسي', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Unit ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  unitId?: number;

  @ApiProperty({ description: 'Project ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  projectId?: number;
}