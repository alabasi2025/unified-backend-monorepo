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

// Item Categories
import { ItemCategoriesController } from './item-categories/item-categories.controller';
import { ItemCategoriesService } from './item-categories/item-categories.service';

// Units
import { UnitsController } from './units/units.controller';
import { UnitsService } from './units/units.service';

@Module({
  controllers: [
    WarehousesController,
    ItemsController,
    StockMovementsController,
    ItemCategoriesController,
    UnitsController
  ],
  providers: [
    PrismaService,
    WarehousesService,
    ItemsService,
    StockMovementsService,
    ItemCategoriesService,
    UnitsService
  ],
  exports: [
    WarehousesService,
    ItemsService,
    StockMovementsService
  ]
})
export class InventoryModule {}
