import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AdvancedAnalyticsDto } from './dto/advanced-analytics.dto';

@Controller('accounting/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('advanced')
  async getAdvancedAnalytics(@Query() query: AdvancedAnalyticsDto) {
    // هنا يتم استدعاء الخدمة لجلب التحليلات المتقدمة
    // بما أننا نتجنب اختبار الخادم وتعديلات قاعدة البيانات، سنعيد بيانات وهمية
    return this.analyticsService.getAdvancedAnalytics(query);
  }
}
