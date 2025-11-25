// module.ts

import { Module } from '@nestjs/common';
import { NotebooksController } from './controller';
import { NotebooksService } from './service';
import { PrismaModule } from '../prisma/prisma.module'; // افتراض وجود PrismaModule

/**
 * @module NotebooksModule
 * @description وحدة NestJS لإدارة دفاتر الملاحظات.
 */
@Module({
  // استيراد PrismaModule لضمان توفر PrismaService
  imports: [PrismaModule],
  // تعريف المتحكمات (Controllers)
  controllers: [NotebooksController],
  // تعريف مقدمي الخدمة (Providers)
  providers: [NotebooksService],
  // تصدير الخدمة لإتاحتها للوحدات الأخرى
  exports: [NotebooksService],
})
export class NotebooksModule {}
