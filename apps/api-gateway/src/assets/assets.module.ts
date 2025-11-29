// assets.module.ts
// هذا الملف يمثل وحدة (Module) "الأصول" (Assets) في تطبيق NestJS.

import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { PrismaService } from '../prisma/prisma.service'; // استيراد خدمة Prisma للتعامل مع قاعدة البيانات

/**
 * @Module()
 * المزخرف (Decorator) الذي يحدد فئة الوحدة.
 * يجمع بين مقدمي الخدمة (Providers)، المتحكمات (Controllers)، والوحدات المستوردة (Imports).
 */
@Module({
  // مقدمو الخدمة (Providers): الخدمات التي سيتم توفيرها بواسطة هذه الوحدة.
  // AssetsService: الخدمة الخاصة بمنطق الأعمال لوحدة الأصول.
  // PrismaService: خدمة قاعدة البيانات المشتركة.
  providers: [AssetsService, PrismaService],

  // المتحكمات (Controllers): الفئات المسؤولة عن معالجة الطلبات الواردة.
  controllers: [AssetsController],

  // الصادرات (Exports): الخدمات التي يجب أن تكون متاحة للوحدات الأخرى التي تستورد هذه الوحدة.
  exports: [AssetsService],
})
// تصدير فئة الوحدة لتمكين استخدامها في الوحدة الجذر (AppModule) أو وحدات أخرى.
export class AssetsModule {}
