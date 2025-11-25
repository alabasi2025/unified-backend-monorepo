// /home/ubuntu/search-module/search.module.ts
// Module لتعريف Search Module

import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
// نفترض وجود PrismaModule
// import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    // PrismaModule, // لاستخدام PrismaService في SearchService
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService], // لتصدير الخدمة إذا كانت ستستخدم في modules أخرى
})
export class SearchModule {}
