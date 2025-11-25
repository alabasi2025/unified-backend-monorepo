import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { PrismaModule } from '../../../prisma/prisma.module'; // افتراض وجود PrismaModule

/**
 * وحدة التصدير (ExportModule)
 * تجمع بين Controller و Service و Providers الأخرى المتعلقة بعمليات التصدير.
 */
@Module({
  imports: [PrismaModule], // يجب استيراد PrismaModule للوصول إلى PrismaService
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService], // تصدير الخدمة لاستخدامها في وحدات أخرى إذا لزم الأمر
})
export class ExportModule {}
