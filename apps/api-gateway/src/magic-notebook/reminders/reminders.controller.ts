import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@ApiTags('reminders')
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new reminder' })
  @ApiResponse({ status: 201, description: 'The reminder has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(createReminderDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all reminders or filter by page' })
  @ApiQuery({ name: 'pageId', required: false, description: 'Filter reminders by page ID' })
  @ApiResponse({ status: 200, description: 'List of reminders.' })
  findAll(@Query('pageId') pageId?: string) {
    if (pageId) {
      return this.remindersService.findByPageId(pageId);
    }
    return this.remindersService.findAll();
  }

  @Get('upcoming')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve upcoming reminders (not completed)' })
  @ApiResponse({ status: 200, description: 'List of upcoming reminders.' })
  findUpcoming() {
    return this.remindersService.findUpcoming();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single reminder by ID' })
  @ApiResponse({ status: 200, description: 'The found reminder.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  findOne(@Param('id') id: string) {
    return this.remindersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing reminder by ID' })
  @ApiResponse({ status: 200, description: 'The reminder has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto) {
    return this.remindersService.update(id, updateReminderDto);
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a reminder as completed' })
  @ApiResponse({ status: 200, description: 'The reminder has been marked as completed.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  markAsCompleted(@Param('id') id: string) {
    return this.remindersService.markAsCompleted(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a reminder by ID' })
  @ApiResponse({ status: 204, description: 'The reminder has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  remove(@Param('id') id: string) {
    return this.remindersService.remove(id);
  }
}
