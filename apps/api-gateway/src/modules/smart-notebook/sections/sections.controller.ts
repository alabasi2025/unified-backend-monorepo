import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionsService } from './sections.service';
@Controller('smart-notebook/sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}
  @Post() create(@Body() createDto: any) { return this.sectionsService.create(createDto); }
  @Get() findAll() { return this.sectionsService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.sectionsService.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() updateDto: any) { return this.sectionsService.update(id, updateDto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.sectionsService.remove(id); }
}
