import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ItemCategoriesService } from './item-categories.service';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ItemCategoryDto } from './dto/item-category.dto';

@ApiTags('أصناف المواد')
@Controller('item-categories')
export class ItemCategoriesController {
  constructor(private readonly itemCategoriesService: ItemCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء صنف مادة جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الصنف بنجاح', type: ItemCategoryDto })
  create(@Body() createItemCategoryDto: CreateItemCategoryDto): ItemCategoryDto {
    return this.itemCategoriesService.create(createItemCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع أصناف المواد' })
  @ApiResponse({ status: 200, description: 'قائمة الأصناف', type: [ItemCategoryDto] })
  findAll(): ItemCategoryDto[] {
    return this.itemCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب صنف مادة بالمعرف' })
  @ApiResponse({ status: 200, description: 'الصنف المطلوب', type: ItemCategoryDto })
  @ApiResponse({ status: 404, description: 'الصنف غير موجود' })
  findOne(@Param('id', ParseIntPipe) id: number): ItemCategoryDto {
    return this.itemCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث صنف مادة' })
  @ApiResponse({ status: 200, description: 'تم تحديث الصنف بنجاح', type: ItemCategoryDto })
  @ApiResponse({ status: 404, description: 'الصنف غير موجود' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateItemCategoryDto: UpdateItemCategoryDto): ItemCategoryDto {
    return this.itemCategoriesService.update(id, updateItemCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف صنف مادة' })
  @ApiResponse({ status: 204, description: 'تم حذف الصنف بنجاح' })
  @ApiResponse({ status: 404, description: 'الصنف غير موجود' })
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.itemCategoriesService.remove(id);
  }
}
