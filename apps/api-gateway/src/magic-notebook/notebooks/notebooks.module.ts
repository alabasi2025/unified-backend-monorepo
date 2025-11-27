import { Module } from '@nestjs/common';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [NotebooksController],
  providers: [NotebooksService, PrismaService],
  exports: [NotebooksService],
})
export class NotebooksModule {}
