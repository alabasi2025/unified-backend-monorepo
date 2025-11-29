// wallet.module.ts
// هذا الملف يمثل الوحدة (Module) الخاصة بإدارة المحافظ (Wallets) في تطبيق NestJS.

import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from '../prisma/prisma.service';

/**
 * @Module() decorator يحدد فئة كـ NestJS Module.
 * يحتوي على metadata لتنظيم بنية التطبيق.
 */
@Module({
  // الموفرون (Providers): الخدمات التي يمكن حقنها (inject) واستخدامها داخل هذا الـ Module.
  // يتم تسجيل WalletService و PrismaService هنا.
  providers: [WalletService, PrismaService],
  
  // المتحكمون (Controllers): المسؤولون عن معالجة الطلبات الواردة وتوجيهها.
  controllers: [WalletController],
  
  // التصديرات (Exports): الخدمات التي يجب أن تكون متاحة للاستخدام في الـ Modules الأخرى التي تستورد هذا الـ Module.
  // يتم تصدير WalletService لتمكين استخدامه خارج هذا الـ Module.
  exports: [WalletService],
})
// تصدير فئة الـ Module
export class WalletModule {}
