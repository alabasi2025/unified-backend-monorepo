import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto, FilterReportsDto, ImportReportDto } from './dto/reports.dto';
import { JwtAuthGuard } from '../../../app/auth/guards/jwt-auth.guard';

@Controller('api/smart-notebook/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto, @Request() req) {
    return this.reportsService.create(createReportDto, req.user.id);
  }

  @Post('import')
  import(@Body() importReportDto: ImportReportDto, @Request() req) {
    return this.reportsService.import(importReportDto, req.user.id);
  }

  @Get()
  findAll(@Query() filter: FilterReportsDto) {
    return this.reportsService.findAll(filter);
  }

  @Get('statistics')
  getStatistics() {
    return this.reportsService.getStatistics();
  }

  @Get('search')
  search(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.reportsService.search(query, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto, @Request() req) {
    return this.reportsService.update(id, updateReportDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
