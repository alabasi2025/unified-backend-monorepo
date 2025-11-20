import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';

export interface CreateStockMovementDto {
  warehouseId: string;
  itemId: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
}

export interface UpdateStockMovementDto {
  quantity?: number;
  notes?: string;
}

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  findAll(@Query('warehouseId') warehouseId?: string) {
    return this.stockMovementsService.findAll(warehouseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockMovementsService.findOne(id);
  }

  @Post()
  create(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.create(createStockMovementDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockMovementDto: UpdateStockMovementDto) {
    return this.stockMovementsService.update(id, updateStockMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockMovementsService.remove(id);
  }
}
