import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskProgressReportsService } from './task-progress-reports.service';
import {
  CreateTaskProgressReportDto,
  UpdateTaskProgressReportDto,
  GenerateTaskProgressReportDto,
} from './dto/create-task-progress-report.dto';

@Controller('task-progress-reports')
export class TaskProgressReportsController {
  constructor(
    private readonly taskProgressReportsService: TaskProgressReportsService,
  ) {}

  @Post()
  create(@Body() createDto: CreateTaskProgressReportDto) {
    return this.taskProgressReportsService.create(createDto);
  }

  @Post('generate')
  generate(@Body() generateDto: GenerateTaskProgressReportDto) {
    return this.taskProgressReportsService.generate(generateDto);
  }

  @Get()
  findAll(
    @Query('system') system?: string,
    @Query('project') project?: string,
    @Query('minProgress') minProgress?: string,
    @Query('maxProgress') maxProgress?: string,
  ) {
    return this.taskProgressReportsService.findAll({
      system,
      project,
      minProgress: minProgress ? parseFloat(minProgress) : undefined,
      maxProgress: maxProgress ? parseFloat(maxProgress) : undefined,
    });
  }

  @Get('statistics')
  getStatistics() {
    return this.taskProgressReportsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskProgressReportsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTaskProgressReportDto,
  ) {
    return this.taskProgressReportsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskProgressReportsService.remove(id);
  }
}
