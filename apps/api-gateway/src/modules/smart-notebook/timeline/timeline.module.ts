// /home/ubuntu/timeline-module/module.ts
// Module definition لـ Timeline Module

import { Module } from '@nestjs/common';
import { TimelineController } from './controller';
import { TimelineService } from './service';
import { PrismaModule } from '../prisma/prisma.module'; // افتراض وجود PrismaModule

@Module({
  imports: [PrismaModule], // استيراد PrismaModule للوصول إلى PrismaService
  controllers: [TimelineController],
  providers: [TimelineService],
  // تصدير الخدمة للسماح للوحدات الأخرى باستخدامها لتسجيل الأحداث
  exports: [TimelineService],
})
export class TimelineModule {}
