// src/scm/scm.module.ts

import { Module } from '@nestjs/common';
import { ScmService } from './scm.service';
import { ScmController } from './scm.controller';
import { PrismaService } from '../prisma/prisma.service';

/**
 * ScmModule
 * الوحدة المسؤولة عن إدارة عمليات سلسلة التوريد (Supply Chain Management - SCM).
 * تتضمن هذه الوحدة الخدمات والمتحكمات اللازمة لمعالجة بيانات SCM.
 */
@Module({
  // تحديد المتحكمات (Controllers) التي تتعامل مع الطلبات الواردة لهذه الوحدة.
  controllers: [ScmController],
  
  // تحديد المزودين (Providers) الذين يمكن حقنهم (Injected) في هذه الوحدة،
  // بما في ذلك الخدمة الخاصة بالوحدة وخدمة Prisma للتعامل مع قاعدة البيانات.
  providers: [ScmService, PrismaService],
  
  // تصدير الخدمات (Services) التي يمكن استخدامها من قبل وحدات أخرى تستورد ScmModule.
  exports: [ScmService],
})
export class ScmModule {}
