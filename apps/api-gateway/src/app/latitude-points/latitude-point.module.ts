import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatitudePointController } from './latitude-point.controller';
import { LatitudePointService } from './latitude-point.service';
import { LatitudePoint } from './latitude_point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LatitudePoint])],
  controllers: [LatitudePointController],
  providers: [LatitudePointService],
  exports: [LatitudePointService], // لتصدير الخدمة إذا كانت ستستخدم في وحدات أخرى
})
export class LatitudePointModule {}
