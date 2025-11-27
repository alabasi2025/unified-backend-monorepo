import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenesController } from './genes.controller';
import { GenesService } from './genes.service';
import { Gene } from './genes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gene])],
  controllers: [GenesController],
  providers: [GenesService],
  exports: [GenesService], // لتصدير الخدمة واستخدامها في وحدات أخرى
})
export class GenesModule {}
