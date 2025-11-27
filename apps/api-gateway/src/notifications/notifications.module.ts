// src/notifications/notifications.module.ts

import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from '../prisma/prisma.service';

/**
 * @Module() decorator defines the module and its metadata.
 * It takes an object with properties:
 * - imports: List of imported modules.
 * - controllers: List of controllers defined in this module.
 * - providers: List of providers (services, factories, etc.) defined in this module.
 * - exports: Subset of providers that should be available in other modules that import this one.
 */
@Module({
  // Providers (Services) used within this module.
  // PrismaService is included as it's a common dependency for data access.
  providers: [NotificationsService, PrismaService],
  
  // Controllers that handle incoming requests.
  controllers: [NotificationsController],
  
  // Services to be exported for use in other modules.
  exports: [NotificationsService],
})
// The module class, named in PascalCase.
export class NotificationsModule {}
