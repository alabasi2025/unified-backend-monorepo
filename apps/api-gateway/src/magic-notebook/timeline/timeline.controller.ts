import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TimelineService } from './timeline.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';

@ApiTags('timeline')
@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new timeline entry' })
  @ApiResponse({ status: 201, description: 'The timeline entry has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTimelineDto: CreateTimelineDto) {
    // Logic to create a timeline entry
    return this.timelineService.create(createTimelineDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all timeline entries' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all timeline entries.' })
  findAll() {
    // Logic to find all timeline entries
    return this.timelineService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single timeline entry by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the timeline entry.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param('id') id: string) {
    // Logic to find a single timeline entry
    return this.timelineService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing timeline entry' })
  @ApiResponse({ status: 200, description: 'The timeline entry has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateTimelineDto: UpdateTimelineDto) {
    // Logic to update a timeline entry
    return this.timelineService.update(id, updateTimelineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a timeline entry by ID' })
  @ApiResponse({ status: 204, description: 'The timeline entry has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  remove(@Param('id') id: string) {
    // Logic to delete a timeline entry
    return this.timelineService.remove(id);
  }
}
