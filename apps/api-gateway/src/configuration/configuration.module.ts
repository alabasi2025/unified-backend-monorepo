// configuration.module.ts
import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { PrismaService } from '../prisma/prisma.service';

/**
 * @Module() decorator defines the module.
 * It takes an object with properties:
 * - controllers: The set of controllers defined in this module.
 * - providers: The set of providers (services, etc.) that will be instantiated by the Nest injector.
 * - imports: A list of imported modules that export the providers which are required in this module.
 * - exports: The subset of providers that are provided by this module and should be available in other modules.
 */
@Module({
  // تسجيل المتحكم (Controller) الخاص بالـ Configuration
  controllers: [ConfigurationController],
  // تسجيل المزود (Service) الخاص بالـ Configuration و PrismaService كمزود بيانات
  providers: [ConfigurationService, PrismaService],
  // تصدير الـ ConfigurationService ليتم استخدامه في وحدات أخرى إذا لزم الأمر
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
