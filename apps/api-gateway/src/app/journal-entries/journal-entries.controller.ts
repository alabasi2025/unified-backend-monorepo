import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';

@Controller('journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Get()
  findAll(@Query() filters: any) {
    return this.journalEntriesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journalEntriesService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.journalEntriesService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.journalEntriesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journalEntriesService.remove(id);
  }

  @Post(':id/post')
  post(@Param('id') id: string) {
    return this.journalEntriesService.post(id);
  }
}
