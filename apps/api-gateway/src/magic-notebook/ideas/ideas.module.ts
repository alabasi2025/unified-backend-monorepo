import { Module } from '@nestjs/common';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [IdeasController],
  providers: [IdeasService, PrismaService],
  exports: [IdeasService],
})
export class IdeasModule {}
