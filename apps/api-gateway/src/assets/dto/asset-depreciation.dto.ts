import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsDateString, Min } from 'class-validator';

export class AssetDepreciationDTO {
  @ApiProperty({ description: 'Asset ID', example: 1 })
  @IsInt()
  assetId: number;

  @ApiProperty({ description: 'Period date', example: '2025-01-31' })
  @IsDateString()
  periodDate: string;

  @ApiProperty({ description: 'Depreciation amount', example: 2083.33 })
  @IsNumber()
  @Min(0)
  depreciationAmount: number;

  @ApiProperty({ description: 'Accumulated depreciation', example: 25000.0 })
  @IsNumber()
  @Min(0)
  accumulatedDepreciation: number;

  @ApiProperty({ description: 'Book value', example: 225000.0 })
  @IsNumber()
  @Min(0)
  bookValue: number;

  @ApiProperty({ description: 'Fiscal year ID', example: 1 })
  @IsInt()
  fiscalYearId: number;

  @ApiProperty({ description: 'Fiscal period ID', example: 1 })
  @IsInt()
  fiscalPeriodId: number;
}