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
import { IdeasService } from './ideas.service';
import { CreateIdeaDto, UpdateIdeaDto, FilterIdeasDto, ChangeStatusDto } from './dto/ideas.dto';
import { JwtAuthGuard } from '../../../app/auth/guards/jwt-auth.guard';

@Controller('api/smart-notebook/ideas')
@UseGuards(JwtAuthGuard)
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  /**
   * إنشاء فكرة جديدة
   * POST /api/smart-notebook/ideas
   */
  @Post()
  create(@Body() createIdeaDto: CreateIdeaDto, @Request() req) {
    return this.ideasService.create(createIdeaDto, req.user.id);
  }

  /**
   * الحصول على جميع الأفكار مع التصفية
   * GET /api/smart-notebook/ideas
   */
  @Get()
  findAll(@Query() filter: FilterIdeasDto) {
    return this.ideasService.findAll(filter);
  }

  /**
   * الحصول على إحصائيات الأفكار
   * GET /api/smart-notebook/ideas/statistics
   */
  @Get('statistics')
  getStatistics() {
    return this.ideasService.getStatistics();
  }

  /**
   * الحصول على فكرة واحدة
   * GET /api/smart-notebook/ideas/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ideasService.findOne(id);
  }

  /**
   * تحديث فكرة
   * PATCH /api/smart-notebook/ideas/:id
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIdeaDto: UpdateIdeaDto,
    @Request() req,
  ) {
    return this.ideasService.update(id, updateIdeaDto, req.user.id);
  }

  /**
   * حذف فكرة
   * DELETE /api/smart-notebook/ideas/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ideasService.remove(id);
  }

  /**
   * تحويل فكرة إلى مهمة
   * POST /api/smart-notebook/ideas/:id/convert-to-task
   */
  @Post(':id/convert-to-task')
  convertToTask(@Param('id') id: string, @Request() req) {
    return this.ideasService.convertToTask(id, req.user.id);
  }

  /**
   * تغيير حالة الفكرة
   * PATCH /api/smart-notebook/ideas/:id/status
   */
  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
    @Request() req,
  ) {
    return this.ideasService.changeStatus(
      id,
      changeStatusDto.status,
      req.user.id,
    );
  }
}
