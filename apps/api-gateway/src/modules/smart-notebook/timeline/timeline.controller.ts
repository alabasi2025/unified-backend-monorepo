import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { TimelineService } from './timeline.service';

@Controller('smart-notebook/timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.timelineService.createEvent(createDto);
  }

  @Get()
  findAll(@Query('entityType') entityType?: string, @Query('entityId') entityId?: string) {
    return this.timelineService.findAll(entityType, entityId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timelineService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timelineService.remove(id);
  }
}
