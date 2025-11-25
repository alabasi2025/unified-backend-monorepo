import { Module } from '@nestjs/common';
import { StickyNotesController } from './sticky-notes.controller';
import { StickyNotesService } from './sticky-notes.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StickyNotesController],
  providers: [StickyNotesService],
  exports: [StickyNotesService],
})
export class StickyNotesModule {}
