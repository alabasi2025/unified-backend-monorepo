/**
 * PHASE 10: Shared Prisma Module
 * Centralized Prisma module for all layers
 */

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
