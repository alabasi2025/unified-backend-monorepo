import { Module } from '@nestjs/common';
import { GenesService } from './genes.service';
import { GenesController } from './genes.controller';
import { PrismaModule } from '../../prisma/prisma.module'; // افتراض وجود PrismaModule في هذا المسار

@Module({
  imports: [PrismaModule], // استيراد PrismaModule بدلاً من TypeOrmModule
  controllers: [GenesController],
  providers: [GenesService],
})
export class GenesModule {}
