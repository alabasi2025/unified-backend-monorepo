import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

// Pages
import { NotebookPagesController } from './pages/pages.controller';
import { NotebookPagesService } from './pages/pages.service';

// Sticky Notes
import { StickyNotesController } from './sticky-notes/sticky-notes.controller';
import { StickyNotesService } from './sticky-notes/sticky-notes.service';

// Timeline
import { TimelineController } from './timeline/timeline.controller';
import { TimelineService } from './timeline/timeline.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    NotebookPagesController,
    StickyNotesController,
    TimelineController,
  ],
  providers: [
    NotebookPagesService,
    StickyNotesService,
    TimelineService,
  ],
  exports: [
    NotebookPagesService,
    StickyNotesService,
    TimelineService,
  ],
})
export class UnifiedNotebookModule {}
