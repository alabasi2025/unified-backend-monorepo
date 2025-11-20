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
import { DocumentationService } from './documentation.service';

@Controller('documentation')
export class DocumentationController {
  constructor(private readonly docService: DocumentationService) {}

  // ========================================
  // 1. الوثائق (Documents)
  // ========================================

  @Post()
  async createDocument(@Body() body: any) {
    return this.docService.createDocument(body);
  }

  @Get()
  async getAllDocuments(
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('module') module?: string,
    @Query('status') status?: string,
    @Query('isPublished') isPublished?: string,
  ) {
    return this.docService.getAllDocuments({
      category,
      type,
      module,
      status,
      isPublished: isPublished === 'true',
    });
  }

  @Get('slug/:slug')
  async getDocumentBySlug(@Param('slug') slug: string) {
    return this.docService.getDocumentBySlug(slug);
  }

  @Get(':id')
  async getDocument(@Param('id') id: string) {
    return this.docService.getDocument(id);
  }

  @Patch(':id')
  async updateDocument(
    @Param('id') id: string,
    @Body() body: any,
    @Query('updatedBy') updatedBy: string,
  ) {
    return this.docService.updateDocument(id, body, updatedBy);
  }

  @Patch(':id/publish')
  async publishDocument(@Param('id') id: string) {
    return this.docService.publishDocument(id);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string) {
    return this.docService.deleteDocument(id);
  }

  // ========================================
  // 2. الأقسام (Sections)
  // ========================================

  @Post('sections')
  async addSection(@Body() body: any) {
    return this.docService.addSection(body);
  }

  @Patch('sections/:id')
  async updateSection(@Param('id') id: string, @Body() body: any) {
    return this.docService.updateSection(id, body);
  }

  @Delete('sections/:id')
  async deleteSection(@Param('id') id: string) {
    return this.docService.deleteSection(id);
  }

  // ========================================
  // 3. سجل التحديثات (Changelog)
  // ========================================

  @Post('changelog')
  async createChangelog(@Body() body: any) {
    return this.docService.createChangelog(body);
  }

  @Get('changelog/all')
  async getAllChangelogs(
    @Query('type') type?: string,
    @Query('importance') importance?: string,
    @Query('isPublished') isPublished?: string,
  ) {
    return this.docService.getAllChangelogs({
      type,
      importance,
      isPublished: isPublished === 'true',
    });
  }

  @Get('changelog/:id')
  async getChangelog(@Param('id') id: string) {
    return this.docService.getChangelog(id);
  }

  @Patch('changelog/:id/publish')
  async publishChangelog(@Param('id') id: string) {
    return this.docService.publishChangelog(id);
  }

  // ========================================
  // 4. تقدم المهام (Task Progress)
  // ========================================

  @Post('task-progress')
  async createTaskProgress(@Body() body: any) {
    return this.docService.createTaskProgress(body);
  }

  @Patch('task-progress/:id')
  async updateTaskProgress(@Param('id') id: string, @Body() body: any) {
    return this.docService.updateTaskProgress(id, body);
  }

  @Get('task-progress/all')
  async getAllTaskProgress(
    @Query('module') module?: string,
    @Query('status') status?: string,
  ) {
    return this.docService.getAllTaskProgress({ module, status });
  }

  @Get('task-progress/summary')
  async getProgressSummary() {
    return this.docService.getProgressSummary();
  }

  // ========================================
  // 5. البحث (Search)
  // ========================================

  @Get('search/query')
  async searchDocuments(
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('module') module?: string,
  ) {
    return this.docService.searchDocuments(query, { category, module });
  }

  @Post(':id/index')
  async indexDocument(@Param('id') id: string) {
    return this.docService.indexDocument(id);
  }

  // ========================================
  // 6. التعليقات (Feedback)
  // ========================================

  @Post('feedback')
  async addFeedback(@Body() body: any) {
    return this.docService.addFeedback(body);
  }

  @Get(':id/feedback')
  async getDocumentFeedback(@Param('id') id: string) {
    return this.docService.getDocumentFeedback(id);
  }

  @Patch('feedback/:id/respond')
  async respondToFeedback(
    @Param('id') id: string,
    @Body() body: { response: string; respondedBy: string },
  ) {
    return this.docService.respondToFeedback(
      id,
      body.response,
      body.respondedBy,
    );
  }

  // ========================================
  // 7. الإحصائيات (Stats)
  // ========================================

  @Get('stats/overview')
  async getDocumentationStats() {
    return this.docService.getDocumentationStats();
  }

  // ========================================
  // 8. التحديث التلقائي
  // ========================================

  @Post('auto-update/:taskId')
  async autoUpdateOnTaskComplete(@Param('taskId') taskId: string) {
    return this.docService.autoUpdateOnTaskComplete(taskId);
  }
}
