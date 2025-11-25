import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { OneNoteService } from './onenote.service';

@Controller('smart-notebook/onenote')
export class OneNoteController {
  constructor(private readonly oneNoteService: OneNoteService) {}

  @Post('import')
  async importFromOneNote(@Body() dto: { notebookId: string; accessToken: string }) {
    return this.oneNoteService.importNotebook(dto.notebookId, dto.accessToken);
  }

  @Post('export')
  async exportToOneNote(@Body() dto: { pageId: string; accessToken: string }) {
    return this.oneNoteService.exportPage(dto.pageId, dto.accessToken);
  }

  @Post('sync')
  async syncWithOneNote(@Body() dto: { userId: string; accessToken: string }) {
    return this.oneNoteService.syncNotebooks(dto.userId, dto.accessToken);
  }

  @Get('notebooks')
  async listNotebooks(@Query('accessToken') accessToken: string) {
    return this.oneNoteService.listNotebooks(accessToken);
  }
}
