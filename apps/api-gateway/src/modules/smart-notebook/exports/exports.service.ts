import { Injectable } from '@nestjs/common';
@Injectable()
export class ExportsService {
  async exportPdf(data: any) { return { format: 'pdf', ...data }; }
  async exportWord(data: any) { return { format: 'word', ...data }; }
  async exportJson(data: any) { return { format: 'json', ...data }; }
  async exportMarkdown(data: any) { return { format: 'markdown', ...data }; }
}
