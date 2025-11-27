import { Module } from '@nestjs/common';
import { NotebooksModule } from './notebooks/notebooks.module';
import { SectionsModule } from './sections/sections.module';
import { PagesModule } from './pages/pages.module';
import { ChatLogsModule } from './chat-logs/chat-logs.module';
import { IdeasModule } from './ideas/ideas.module';
import { TasksModule } from './tasks/tasks.module';
import { ReportsModule } from './reports/reports.module';
import { ArchiveModule } from './archive/archive.module';
import { TimelineModule } from './timeline/timeline.module';
import { StickyNotesModule } from './sticky-notes/sticky-notes.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    NotebooksModule,
    SectionsModule,
    PagesModule,
    ChatLogsModule,
    IdeasModule,
    TasksModule,
    ReportsModule,
    ArchiveModule,
    TimelineModule,
    StickyNotesModule,
    SearchModule,
  ],
})
export class MagicNotebookModule {}
