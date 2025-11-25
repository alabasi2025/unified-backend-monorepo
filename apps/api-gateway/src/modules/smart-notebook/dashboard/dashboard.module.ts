// dashboard.module.ts

import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module'; // افتراض وجود PrismaModule

/**
 * @description: تعريف وحدة لوحة التحكم (Dashboard Module).
 * تقوم بتجميع وحدات التحكم والخدمات والمزودات الخاصة بلوحة التحكم.
 */
@Module({
  // استيراد PrismaModule لضمان توفر PrismaService في هذه الوحدة
  imports: [PrismaModule],
  // تعريف وحدات التحكم (Controllers) التي تتعامل مع طلبات HTTP
  controllers: [DashboardController],
  // تعريف الخدمات (Providers) التي تحتوي على منطق العمل
  providers: [DashboardService],
  // تصدير الخدمات إذا كانت هناك وحدات أخرى ستحتاجها
  exports: [DashboardService],
})
export class DashboardModule {}
