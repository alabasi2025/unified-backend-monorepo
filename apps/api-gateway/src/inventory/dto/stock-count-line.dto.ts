import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class StockCountLineDTO {
  @ApiProperty({ description: 'Stock count ID', example: 1 })
  @IsInt()
  stockCountId: number;

  @ApiProperty({ description: 'Item ID', example: 1 })
  @IsInt()
  itemId: number;

  @ApiProperty({ description: 'System quantity', example: 100 })
  @IsNumber()
  @Min(0)
  systemQuantity: number;

  @ApiProperty({ description: 'Counted quantity', example: 98 })
  @IsNumber()
  @Min(0)
  countedQuantity: number;

  @ApiProperty({ description: 'Variance', example: -2 })
  @IsNumber()
  variance: number;

  @ApiProperty({ description: 'Unit cost', example: 50.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitCost?: number;

  @ApiProperty({ description: 'Variance value', example: -100.0, required: false })
  @IsOptional()
  @IsNumber()
  varianceValue?: number;
}