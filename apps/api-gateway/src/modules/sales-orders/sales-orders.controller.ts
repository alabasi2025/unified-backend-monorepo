import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SalesOrdersService } from './sales-orders.service';
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto';

@Controller('sales-orders')
export class SalesOrdersController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Get()
  findAll() {
    return this.salesOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesOrdersService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateSalesOrderDto) {
    return this.salesOrdersService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSalesOrderDto) {
    return this.salesOrdersService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesOrdersService.remove(id);
  }
}
