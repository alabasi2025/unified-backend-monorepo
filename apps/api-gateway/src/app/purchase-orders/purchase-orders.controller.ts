import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto/purchase-order.dto';
import { PurchaseOrder } from './purchase-order.entity';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  // POST /purchase-orders
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  // GET /purchase-orders
  @Get()
  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersService.findAll();
  }

  // GET /purchase-orders/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.findOne(id);
  }

  // PATCH /purchase-orders/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.update(id, updatePurchaseOrderDto);
  }

  // DELETE /purchase-orders/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.purchaseOrdersService.remove(id);
  }
}
