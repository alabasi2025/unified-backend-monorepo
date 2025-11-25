'''
/**
 * @module SalesOrdersModule
 * @description
 * ##  الموديول الخاص بأوامر البيع (Sales Orders Module)
 * هذا الموديول مسؤول عن تجميع كل ما يتعلق بأوامر البيع، بما في ذلك:
 * - **المتحكم (Controller):** لإدارة طلبات الـ API.
 * - **الخدمة (Service):** لتنفيذ منطق العمل (Business Logic).
 * - **الاعتماديات (Dependencies):** مثل الخدمات الأخرى التي يعتمد عليها.
 */

import { Module } from '@nestjs/common';
import { SalesOrdersController } from './sales-orders.controller';
import { SalesOrdersService } from './sales-orders.service';
import { SalesModule } from '@semop/sales'; // استيراد موديول المبيعات من المكتبة الأساسية

@Module({
  imports: [
    SalesModule, // إضافة موديول المبيعات لتوفير الخدمات الأساسية مثل SalesOrderService
  ],
  controllers: [SalesOrdersController], // تسجيل المتحكم الخاص بأوامر البيع
  providers: [SalesOrdersService], // تسجيل الخدمة الخاصة بأوامر البيع
  exports: [SalesOrdersService] // تصدير الخدمة لإتاحتها في موديولات أخرى إذا لزم الأمر
})
export class SalesOrdersModule {}
'''
