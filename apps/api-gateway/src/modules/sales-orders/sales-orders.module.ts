import { Module } from '@nestjs/common';
import { SalesOrdersController } from './sales-orders.controller';
import { SalesOrdersService } from './sales-orders.service';
import { MultiEntityModule } from '@semop/multi-entity';

@Module({
  imports: [MultiEntityModule],
  controllers: [SalesOrdersController],
  providers: [SalesOrdersService],
  exports: [SalesOrdersService]
})
export class SalesOrdersModule {}
