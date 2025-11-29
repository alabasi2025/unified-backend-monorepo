import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TasksService, Task } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    if (status) {
      return this.tasksService.findByStatus(status);
    }
    return this.tasksService.findAll();
  }

  @Get('active')
  findActive() {
    return this.tasksService.findActive();
  }

  @Get('completed')
  findCompleted() {
    return this.tasksService.findCompleted();
  }

  @Get('statistics')
  getStatistics() {
    return this.tasksService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() taskData: Partial<Task>) {
    return this.tasksService.create(taskData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() taskData: Partial<Task>) {
    return this.tasksService.update(id, taskData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const result = this.tasksService.delete(id);
    return { success: result };
  }
}
