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
import { ChatLogsService } from './chat-logs.service';
import {
  CreateChatLogDto,
  UpdateChatLogDto,
  FilterChatLogsDto,
  LinkToTaskDto,
  CreateTaskFromChatDto,
} from './dto/chat-logs.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('api/smart-notebook/chat-logs')
@UseGuards(JwtAuthGuard)
export class ChatLogsController {
  constructor(private readonly chatLogsService: ChatLogsService) {}

  /**
   * حفظ محادثة جديدة
   * POST /api/smart-notebook/chat-logs
   */
  @Post()
  create(@Body() createChatLogDto: CreateChatLogDto, @Request() req) {
    return this.chatLogsService.create(createChatLogDto, req.user.id);
  }

  /**
   * الحصول على جميع المحادثات مع التصفية
   * GET /api/smart-notebook/chat-logs
   */
  @Get()
  findAll(@Query() filter: FilterChatLogsDto) {
    return this.chatLogsService.findAll(filter);
  }

  /**
   * الحصول على إحصائيات المحادثات
   * GET /api/smart-notebook/chat-logs/statistics
   */
  @Get('statistics')
  getStatistics() {
    return this.chatLogsService.getStatistics();
  }

  /**
   * البحث في المحادثات
   * GET /api/smart-notebook/chat-logs/search
   */
  @Get('search')
  search(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.chatLogsService.search(query, limit);
  }

  /**
   * الحصول على محادثة واحدة
   * GET /api/smart-notebook/chat-logs/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatLogsService.findOne(id);
  }

  /**
   * تحديث محادثة
   * PATCH /api/smart-notebook/chat-logs/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatLogDto: UpdateChatLogDto) {
    return this.chatLogsService.update(id, updateChatLogDto);
  }

  /**
   * حذف محادثة
   * DELETE /api/smart-notebook/chat-logs/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatLogsService.remove(id);
  }

  /**
   * إضافة/إزالة نجمة (مفضلة)
   * POST /api/smart-notebook/chat-logs/:id/toggle-favorite
   */
  @Post(':id/toggle-favorite')
  toggleFavorite(@Param('id') id: string) {
    return this.chatLogsService.toggleFavorite(id);
  }

  /**
   * ربط محادثة بمهمة
   * POST /api/smart-notebook/chat-logs/:id/link-to-task
   */
  @Post(':id/link-to-task')
  linkToTask(@Param('id') id: string, @Body() linkToTaskDto: LinkToTaskDto) {
    return this.chatLogsService.linkToTask(id, linkToTaskDto.taskId);
  }

  /**
   * إنشاء مهمة من محادثة
   * POST /api/smart-notebook/chat-logs/:id/create-task
   */
  @Post(':id/create-task')
  createTaskFromChat(
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskFromChatDto,
    @Request() req,
  ) {
    return this.chatLogsService.createTaskFromChat(id, createTaskDto, req.user.id);
  }
}
