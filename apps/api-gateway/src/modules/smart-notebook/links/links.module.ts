// module.ts
import { Module } from '@nestjs/common';
import { AutoLinksService } from './service';
import { AutoLinksController } from './controller';
import { PrismaModule } from '../prisma/prisma.module'; // افتراض وجود PrismaModule

/**
 * @module AutoLinksModule
 * @description وحدة الروابط التلقائية (Auto-linking) المسؤولة عن إدارة الروابط بين العناصر.
 */
@Module({
  imports: [PrismaModule], // استيراد وحدة Prisma للوصول إلى PrismaService
  controllers: [AutoLinksController],
  providers: [AutoLinksService],
  exports: [AutoLinksService], // تصدير الخدمة إذا كانت ستستخدم في وحدات أخرى
})
export class AutoLinksModule {}
