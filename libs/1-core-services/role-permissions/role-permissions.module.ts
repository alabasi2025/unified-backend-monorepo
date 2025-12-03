// role_permissions.module.ts

import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';
import { RolePermissionsController } from './role_permissions.controller';
import { PrismaModule } from '../../../1-core-services/prisma/prisma.module'; // افتراض وجود PrismaModule

@Module({
  imports: [PrismaModule], // استيراد PrismaModule لتوفير PrismaService
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService],
})
export class RolePermissionsModule {}
