import { Module } from '@nestjs/common';
import { VersionHistoryController } from './version-history.controller';
import { VersionHistoryService } from './version-history.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [VersionHistoryController],
  providers: [VersionHistoryService, PrismaService],
  exports: [VersionHistoryService],
})
export class VersionHistoryModule {}
