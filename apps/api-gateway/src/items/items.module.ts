// inventory.module.ts
// هذا الملف يمثل الوحدة (Module) الخاصة بإدارة المخزون في تطبيق NestJS.

import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
// استيراد خدمة PrismaService للتعامل مع قاعدة البيانات
import { PrismaService } from '../prisma/prisma.service';

/**
 * @Module()
 * يحدد هذا المزخرف (Decorator) الوحدة (Module) ومكوناتها.
 * - providers: الخدمات (Services) التي سيتم توفيرها واستخدامها داخل هذه الوحدة.
 * - controllers: المتحكمات (Controllers) التي تتعامل مع الطلبات الواردة.
 * - exports: الخدمات التي يجب أن تكون متاحة للوحدات الأخرى التي تستورد هذه الوحدة.
 */
@Module({
  // تسجيل الخدمات والمكونات التي يمكن حقنها (Injectable)
  providers: [
    InventoryService, 
    // تضمين PrismaService كـ provider ليكون متاحًا للـ InventoryService
    PrismaService
  ],
  // تسجيل المتحكمات التي تتعامل مع مسارات HTTP
  controllers: [InventoryController],
  // تصدير الخدمة الرئيسية لتمكين الوحدات الأخرى من استخدامها
  exports: [InventoryService],
})
// تصدير فئة الوحدة (Module Class)
export class InventoryModule {}
