import { Module } from '@nestjs/common';
import { ScmPerformanceService } from './services/scm-performance.service';

@Module({
  controllers: [],
  providers: [ScmPerformanceService],
  exports: [ScmPerformanceService],
})
export class ScmModule {}
