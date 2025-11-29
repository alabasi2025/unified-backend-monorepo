// src/billing/billing.module.ts

/**
 * @file BillingModule
 * @description وحدة الفوترة (Billing) في تطبيق NestJS.
 *              تتضمن هذه الوحدة الخدمات (Services) ووحدات التحكم (Controllers)
 *              الخاصة بإدارة عمليات الفوترة والمدفوعات.
 * @module Billing
 */

import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaService } from '../prisma/prisma.service'; // استيراد PrismaService كما هو مطلوب

/**
 * @decorator Module
 * @description يحدد الميتاداتا الخاصة بوحدة الفوترة.
 *              - providers: قائمة بالخدمات التي سيتم توفيرها بواسطة NestJS IoC container.
 *              - controllers: قائمة بوحدات التحكم التي تنتمي لهذه الوحدة.
 *              - exports: قائمة بالموفّرين (Providers) الذين يجب أن يكونوا متاحين للوحدات الأخرى التي تستورد هذه الوحدة.
 */
@Module({
  // تسجيل BillingService و PrismaService كموفّرين (Providers)
  providers: [
    BillingService,
    PrismaService, // تضمين PrismaService للوصول إلى قاعدة البيانات
  ],
  // تسجيل BillingController كوحدة تحكم (Controller)
  controllers: [BillingController],
  // تصدير BillingService لتمكين الوحدات الأخرى من استخدامه
  exports: [BillingService],
})
// تصدير فئة الوحدة (Module Class)
export class BillingModule {}
