import { Module } from '@nestjs/common';
import { IdeasModule } from './ideas/ideas.module';
import { ChatLogsModule } from './chat-logs/chat-logs.module';
import { ReportsModule } from './reports/reports.module';
import { TasksModule } from './tasks/tasks.module';
import { PagesModule } from './pages/pages.module';

// New Modules
import { NotebooksModule } from './notebooks/notebooks.module';
import { SectionsModule } from './sections/sections.module';
import { StickyNotesModule } from './stickynotes/stickynotes.module';
import { TimelineModule } from './timeline/timeline.module';
import { SearchModule } from './search/search.module';
import { ArchiveModule } from './archive/archive.module';
import { LinksModule } from './links/links.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExportsModule } from './exports/exports.module';

@Module({
  imports: [
    // Existing Modules
    IdeasModule,
    ChatLogsModule,
    ReportsModule,
    TasksModule,
    PagesModule,
    // New Modules
    NotebooksModule,
    SectionsModule,
    StickyNotesModule,
    TimelineModule,
    SearchModule,
    ArchiveModule,
    LinksModule,
    DashboardModule,
    ExportsModule,
  ],
  exports: [
    // Existing Modules
    IdeasModule,
    ChatLogsModule,
    ReportsModule,
    TasksModule,
    PagesModule,
    // New Modules
    NotebooksModule,
    SectionsModule,
    StickyNotesModule,
    TimelineModule,
    SearchModule,
    ArchiveModule,
    LinksModule,
    DashboardModule,
    ExportsModule,
  ],
})
export class SmartNotebookModule {}
