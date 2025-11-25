// /home/ubuntu/archive-module/module.ts

import { Module } from '@nestjs/common';
import { ArchiveService } from './service';
import { ArchiveController } from './controller';
import { PrismaModule } from '../prisma/prisma.module'; // افتراض وجود PrismaModule

/**
 * @description تعريف وحدة الأرشفة (Archive Module).
 * تتضمن الـ Controller والـ Service وتعتمد على PrismaModule.
 */
@Module({
  imports: [PrismaModule], // استيراد وحدة Prisma للوصول إلى PrismaService
  controllers: [ArchiveController],
  providers: [ArchiveService],
  exports: [ArchiveService], // تصدير الخدمة لاستخدامها في وحدات أخرى
})
export class ArchiveModule {}
