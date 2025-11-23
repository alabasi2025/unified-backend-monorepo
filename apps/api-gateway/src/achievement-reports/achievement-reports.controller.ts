import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AchievementReportsService } from './achievement-reports.service';
import { CreateAchievementReportDto, AchievementReportType } from './dto/create-achievement-report.dto';

@Controller('achievement-reports')
export class AchievementReportsController {
  constructor(
    private readonly achievementReportsService: AchievementReportsService,
  ) {}

  @Post()
  create(@Body() createReportDto: CreateAchievementReportDto) {
    return this.achievementReportsService.create(createReportDto);
  }

  @Get()
  findAll(
    @Query('type') type?: AchievementReportType,
    @Query('team') team?: string,
    @Query('project') project?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.achievementReportsService.findAll({
      type,
      team,
      project,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievementReportsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievementReportsService.remove(id);
  }

  @Post('generate')
  generateAutoReport(
    @Body()
    params: {
      type: AchievementReportType;
      startDate: string;
      endDate: string;
      team?: string;
      project?: string;
      createdBy: string;
    },
  ) {
    return this.achievementReportsService.generateAutoReport({
      ...params,
      startDate: new Date(params.startDate),
      endDate: new Date(params.endDate),
    });
  }
}
