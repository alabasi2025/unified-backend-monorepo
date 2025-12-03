import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('genes/marketplace')
@ApiTags('genes-marketplace')
export class MarketplaceController {
  @Get()
  @ApiOperation({ summary: 'الحصول على الجينات المتاحة في السوق' })
  getMarketplaceGenes() {
    return { message: 'Marketplace feature - Coming soon' };
  }
}
