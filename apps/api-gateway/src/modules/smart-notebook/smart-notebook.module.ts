import { Module } from '@nestjs/common';
import { IdeasModule } from './ideas/ideas.module';
import { ChatLogsModule } from './chat-logs/chat-logs.module';
import { ReportsModule } from './reports/reports.module';
import { TasksModule } from './tasks/tasks.module';
import { PagesModule } from './pages/pages.module';

@Module({
  imports: [
    IdeasModule,
    ChatLogsModule,
    ReportsModule,
    TasksModule,
    PagesModule,
  ],
  exports: [
    IdeasModule,
    ChatLogsModule,
    ReportsModule,
    TasksModule,
    PagesModule,
  ],
})
export class SmartNotebookModule {}
