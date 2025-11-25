import { Controller, Post, Body } from '@nestjs/common';
import { ExportsService } from './exports.service';
@Controller('smart-notebook/export')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}
  @Post('pdf') exportPdf(@Body() data: any) { return this.exportsService.exportPdf(data); }
  @Post('word') exportWord(@Body() data: any) { return this.exportsService.exportWord(data); }
  @Post('json') exportJson(@Body() data: any) { return this.exportsService.exportJson(data); }
  @Post('markdown') exportMarkdown(@Body() data: any) { return this.exportsService.exportMarkdown(data); }
}
