import { Module } from '@nestjs/common';
import { TaskProgressReportsService } from './task-progress-reports.service';
import { TaskProgressReportsController } from './task-progress-reports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskProgressReportsController],
  providers: [TaskProgressReportsService],
  exports: [TaskProgressReportsService],
})
export class TaskProgressReportsModule {}
