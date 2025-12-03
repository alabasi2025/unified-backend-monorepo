import { Module } from '@nestjs/common';
import { LatitudePointsService } from './latitude_points.service';
import { LatitudePointsController } from './latitude_points.controller';
import { PrismaService } from '../../../0-shared/prisma/prisma.service'; // افتراض وجود PrismaService في هذا المسار

@Module({
  controllers: [LatitudePointsController],
  providers: [LatitudePointsService, PrismaService], // يجب توفير PrismaService هنا أو في Module عام
  exports: [LatitudePointsService],
})
export class LatitudePointsModule {}
