import { Module } from '@nestjs/common';
import { StickyNotesController } from './sticky-notes.controller';
import { StickyNotesService } from './sticky-notes.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [StickyNotesController],
  providers: [StickyNotesService, PrismaService],
  exports: [StickyNotesService],
})
export class StickyNotesModule {}
