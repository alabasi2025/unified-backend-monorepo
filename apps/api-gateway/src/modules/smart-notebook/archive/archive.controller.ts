import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ArchiveService } from './archive.service';
@Controller('smart-notebook/archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}
  @Post() create(@Body() createDto: any) { return this.archiveService.create(createDto); }
  @Get() findAll() { return this.archiveService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.archiveService.findOne(id); }
  @Post(':id/restore') restore(@Param('id') id: string) { return this.archiveService.restore(id); }
  @Delete(':id') remove(@Param('id') id: string) { return this.archiveService.remove(id); }
}
