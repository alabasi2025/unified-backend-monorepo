import { Controller, Post, Body } from '@nestjs/common';
import { AiServicesService } from './ai-services.service';

@Controller('smart-notebook/ai')
export class AiServicesController {
  constructor(private readonly aiService: AiServicesService) {}

  @Post('summarize')
  async summarizeContent(@Body() dto: { content: string; maxLength?: number }) {
    return this.aiService.summarizeContent(dto.content, dto.maxLength);
  }

  @Post('extract-keywords')
  async extractKeywords(@Body() dto: { content: string; count?: number }) {
    return this.aiService.extractKeywords(dto.content, dto.count);
  }

  @Post('suggest-tags')
  async suggestTags(@Body() dto: { content: string }) {
    return this.aiService.suggestTags(dto.content);
  }

  @Post('generate-title')
  async generateTitle(@Body() dto: { content: string }) {
    return this.aiService.generateTitle(dto.content);
  }

  @Post('smart-recommendations')
  async getRecommendations(@Body() dto: { userId: string }) {
    return this.aiService.getSmartRecommendations(dto.userId);
  }
}
