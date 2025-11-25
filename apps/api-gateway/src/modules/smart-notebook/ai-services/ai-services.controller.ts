import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiServicesService } from './ai-services.service';

@ApiTags('AI Services')
@Controller('smart-notebook/ai')
export class AiServicesController {
  constructor(private readonly aiService: AiServicesService) {}

  @Post('summarize')
  @ApiOperation({ summary: 'تلخيص محتوى تلقائي' })
  async summarizeContent(@Body() dto: { content: string; maxLength?: number }) {
    return this.aiService.summarizeContent(dto.content, dto.maxLength);
  }

  @Post('extract-keywords')
  @ApiOperation({ summary: 'استخراج الكلمات المفتاحية' })
  async extractKeywords(@Body() dto: { content: string; count?: number }) {
    return this.aiService.extractKeywords(dto.content, dto.count);
  }

  @Post('suggest-tags')
  @ApiOperation({ summary: 'اقتراح تصنيفات' })
  async suggestTags(@Body() dto: { content: string }) {
    return this.aiService.suggestTags(dto.content);
  }

  @Post('generate-title')
  @ApiOperation({ summary: 'توليد عنوان تلقائي' })
  async generateTitle(@Body() dto: { content: string }) {
    return this.aiService.generateTitle(dto.content);
  }

  @Post('smart-recommendations')
  @ApiOperation({ summary: 'توصيات ذكية' })
  async getRecommendations(@Body() dto: { userId: string }) {
    return this.aiService.getSmartRecommendations(dto.userId);
  }
}
