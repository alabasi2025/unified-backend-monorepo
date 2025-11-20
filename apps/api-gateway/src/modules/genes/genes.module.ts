import { Module } from '@nestjs/common';
import { GenesController } from './genes.controller';
import { GenesService } from './genes.service';

@Module({
  controllers: [GenesController],
  providers: [GenesService],
  exports: [GenesService]
})
export class GenesModule {}
