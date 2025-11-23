import { Module } from '@nestjs/common';
import { AchievementReportsService } from './achievement-reports.service';
import { AchievementReportsController } from './achievement-reports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AchievementReportsController],
  providers: [AchievementReportsService],
  exports: [AchievementReportsService],
})
export class AchievementReportsModule {}
