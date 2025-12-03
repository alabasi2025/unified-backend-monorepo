import { Module } from '@nestjs/common';
import { GenesService } from './genes.service';
import { GenesController } from './genes.controller';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { PrismaModule } from '../../../0-shared/prisma/prisma.module'; // افتراض وجود PrismaModule في هذا المسار

@Module({
  imports: [PrismaModule], // استيراد PrismaModule بدلاً من TypeOrmModule
  controllers: [GenesController, PricingController],
  providers: [GenesService, PricingService],
  exports: [GenesService, PricingService], // تصدير الخدمات لاستخدامها في modules أخرى
})
export class GenesModule {}
