import { Module } from '@nestjs/common';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';

// Warehouses
import { WarehousesController } from './warehouses/warehouses.controller';
import { WarehousesService } from './warehouses/warehouses.service';

// Items
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';

// Stock Movements
import { StockMovementsController } from './stock-movements/stock-movements.controller';
import { StockMovementsService } from './stock-movements/stock-movements.service';

@Module({
  controllers: [
    WarehousesController,
    ItemsController,
    StockMovementsController
  ],
  providers: [
    PrismaService,
    WarehousesService,
    ItemsService,
    StockMovementsService
  ],
  exports: [
    WarehousesService,
    ItemsService,
    StockMovementsService
  ]
})
export class InventoryModule {}
