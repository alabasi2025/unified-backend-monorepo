import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OneNoteService } from './onenote.service';

@ApiTags('OneNote Integration')
@Controller('smart-notebook/onenote')
export class OneNoteController {
  constructor(private readonly oneNoteService: OneNoteService) {}

  @Post('import')
  @ApiOperation({ summary: 'استيراد من OneNote' })
  async importFromOneNote(@Body() dto: { notebookId: string; accessToken: string }) {
    return this.oneNoteService.importNotebook(dto.notebookId, dto.accessToken);
  }

  @Post('export')
  @ApiOperation({ summary: 'تصدير إلى OneNote' })
  async exportToOneNote(@Body() dto: { pageId: string; accessToken: string }) {
    return this.oneNoteService.exportPage(dto.pageId, dto.accessToken);
  }

  @Post('sync')
  @ApiOperation({ summary: 'مزامنة مع OneNote' })
  async syncWithOneNote(@Body() dto: { userId: string; accessToken: string }) {
    return this.oneNoteService.syncNotebooks(dto.userId, dto.accessToken);
  }

  @Get('notebooks')
  @ApiOperation({ summary: 'قائمة دفاتر OneNote' })
  async listNotebooks(@Query('accessToken') accessToken: string) {
    return this.oneNoteService.listNotebooks(accessToken);
  }
}
