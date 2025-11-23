import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { CreateTimelineEventDto, TimelineEventType } from './dto/timeline-event.dto';

@Controller('notebook/timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Post()
  create(@Body() createDto: CreateTimelineEventDto) {
    return this.timelineService.create(createDto);
  }

  @Get()
  findAll(
    @Query('eventType') eventType?: TimelineEventType,
    @Query('conversationId') conversationId?: string,
    @Query('ideaId') ideaId?: string,
    @Query('taskId') taskId?: string,
    @Query('pageId') pageId?: string,
    @Query('createdBy') createdBy?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    
    if (eventType) filters.eventType = eventType;
    if (conversationId) filters.conversationId = conversationId;
    if (ideaId) filters.ideaId = ideaId;
    if (taskId) filters.taskId = taskId;
    if (pageId) filters.pageId = pageId;
    if (createdBy) filters.createdBy = createdBy;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.timelineService.findAll(filters);
  }

  @Get('entity/:entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.timelineService.findByEntity(entityType, entityId);
  }

  @Get('statistics')
  getStatistics(
    @Query('createdBy') createdBy?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    
    if (createdBy) filters.createdBy = createdBy;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.timelineService.getStatistics(filters);
  }
}
