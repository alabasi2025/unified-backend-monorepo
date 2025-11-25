import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StickyNotesService } from './sticky-notes.service';

@Controller('magic-notebook/sticky-notes')
export class StickyNotesController {
  constructor(private readonly service: StickyNotesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
