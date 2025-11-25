import { Module } from '@nestjs/common';
import { SectionsController } from './controller';
import { SectionsService } from './service';
import { PrismaModule } from '../prisma/prisma.module'; // افتراض وجود PrismaModule

/**
 * SectionsModule
 * الوحدة المسؤولة عن تجميع المكونات المتعلقة بإدارة الأقسام (Sections).
 * تستورد PrismaModule لتوفير PrismaService في هذه الوحدة.
 */
@Module({
  imports: [PrismaModule], // استيراد وحدة Prisma لتوفير خدمة قاعدة البيانات
  controllers: [SectionsController], // تسجيل المتحكم (Controller)
  providers: [SectionsService], // تسجيل الخدمة (Service)
  exports: [SectionsService], // تصدير الخدمة لاستخدامها في وحدات أخرى إذا لزم الأمر
})
export class SectionsModule {}
