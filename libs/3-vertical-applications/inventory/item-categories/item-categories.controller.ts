import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemCategoriesService } from './item-categories.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Item Categories')
@Controller('item-categories')
export class ItemCategoriesController {
  constructor(private readonly itemCategoriesService: ItemCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item category' })
  create(@Body() createDto: any) {
    return this.itemCategoriesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all item categories' })
  findAll() {
    return this.itemCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item category by ID' })
  findOne(@Param('id') id: string) {
    return this.itemCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item category' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.itemCategoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete item category' })
  remove(@Param('id') id: string) {
    return this.itemCategoriesService.remove(id);
  }
}
