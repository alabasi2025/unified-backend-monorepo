import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';

export interface CreateStockMovementDto {
  warehouseId: string;
  itemId: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  unitCost?: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  holdingId?: string;
  unitId?: string;
  projectId?: string;
}

export interface UpdateStockMovementDto {
  quantity?: number;
  notes?: string;
  referenceType?: string;
  referenceId?: string;
}

export interface StockMovementFilters {
  warehouseId?: string;
  itemId?: string;
  movementType?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  /**
   * الحصول على جميع حركات المخزون مع الفلاتر و pagination
   */
  @Get()
  findAll(
    @Query('warehouseId') warehouseId?: string,
    @Query('itemId') itemId?: string,
    @Query('movementType') movementType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10
  ) {
    const filters: StockMovementFilters = {
      warehouseId,
      itemId,
      movementType,
      startDate,
      endDate,
      skip: parseInt(skip.toString()),
      take: parseInt(take.toString())
    };
    return this.stockMovementsService.findAll(filters);
  }

  /**
   * الحصول على حركة واحدة بالمعرف
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockMovementsService.findOne(id);
  }

  /**
   * الحصول على إحصائيات حركات المخزون
   */
  @Get('statistics/summary')
  getStatistics() {
    return this.stockMovementsService.getStatistics();
  }

  /**
   * الحصول على إحصائيات حسب المستودع
   */
  @Get('statistics/warehouse/:warehouseId')
  getWarehouseStatistics(@Param('warehouseId') warehouseId: string) {
    return this.stockMovementsService.getWarehouseStatistics(warehouseId);
  }

  /**
   * الحصول على إحصائيات حسب الصنف
   */
  @Get('statistics/item/:itemId')
  getItemStatistics(@Param('itemId') itemId: string) {
    return this.stockMovementsService.getItemStatistics(itemId);
  }

  /**
   * إنشاء حركة مخزون جديدة
   */
  @Post()
  create(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.create(createStockMovementDto);
  }

  /**
   * تحديث حركة مخزون
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockMovementDto: UpdateStockMovementDto) {
    return this.stockMovementsService.update(id, updateStockMovementDto);
  }

  /**
   * حذف حركة مخزون
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockMovementsService.remove(id);
  }
}
