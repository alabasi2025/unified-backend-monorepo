import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { LinksService } from './links.service';
@Controller('smart-notebook/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}
  @Post() create(@Body() createDto: any) { return this.linksService.create(createDto); }
  @Get() findAll() { return this.linksService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.linksService.findOne(id); }
  @Delete(':id') remove(@Param('id') id: string) { return this.linksService.remove(id); }
}
