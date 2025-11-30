import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('genes/analytics')
@ApiTags('genes-analytics')
export class AnalyticsController {
  @Get()
  @ApiOperation({ summary: 'تحليلات استخدام الجينات' })
  getAnalytics() {
    return { message: 'Analytics feature - Coming soon' };
  }
}
