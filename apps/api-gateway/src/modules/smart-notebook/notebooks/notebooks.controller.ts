import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';

@Controller('smart-notebook/notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.notebooksService.create(createDto);
  }

  @Get()
  findAll() {
    return this.notebooksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notebooksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.notebooksService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notebooksService.remove(id);
  }
}
