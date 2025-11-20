/**
 * SEMOP - Multi-Entity Module
 * وحدة نظام الكيانات المتعددة (Holding → Unit → Project)
 * 
 * @module MultiEntityModule
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HoldingService } from './services/holding.service';
import { UnitService } from './services/unit.service';
import { ProjectService } from './services/project.service';

@Global()
@Module({
  controllers: [],
  providers: [
    PrismaService,
    HoldingService,
    UnitService,
    ProjectService,
  ],
  exports: [
    PrismaService,
    HoldingService,
    UnitService,
    ProjectService,
  ],
})
export class MultiEntityModule {}
