import { ApiProperty } from '@nestjs/swagger';

export class StockLevelDTO {
  @ApiProperty({ description: 'Item ID', example: 1 })
  itemId: number;

  @ApiProperty({ description: 'Item name', example: 'لابتوب HP' })
  itemName: string;

  @ApiProperty({ description: 'Warehouse ID', example: 1 })
  warehouseId: number;

  @ApiProperty({ description: 'Warehouse name', example: 'المستودع الرئيسي' })
  warehouseName: string;

  @ApiProperty({ description: 'Current quantity', example: 50 })
  currentQuantity: number;

  @ApiProperty({ description: 'Reserved quantity', example: 10 })
  reservedQuantity: number;

  @ApiProperty({ description: 'Available quantity', example: 40 })
  availableQuantity: number;

  @ApiProperty({ description: 'Reorder level', example: 20, required: false })
  reorderLevel?: number;

  @ApiProperty({ description: 'Maximum level', example: 100, required: false })
  maximumLevel?: number;

  @ApiProperty({ description: 'Unit cost', example: 2500.0 })
  unitCost: number;

  @ApiProperty({ description: 'Total value', example: 125000.0 })
  totalValue: number;

  @ApiProperty({ description: 'Last movement date', example: '2025-01-15T10:30:00.000Z' })
  lastMovementDate: Date;
}