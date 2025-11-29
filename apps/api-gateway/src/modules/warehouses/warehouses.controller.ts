import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';

export interface CreateWarehouseDto {
  code: string;
  nameAr: string;
  nameEn?: string;
  location?: string;
  managerId?: string;
  capacity?: number;
  isActive: boolean;
}

export interface UpdateWarehouseDto {
  code?: string;
  nameAr?: string;
  nameEn?: string;
  location?: string;
  managerId?: string;
  capacity?: number;
  isActive?: boolean;
}

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }
}
