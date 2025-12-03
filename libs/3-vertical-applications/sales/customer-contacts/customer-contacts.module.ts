import { Module } from '@nestjs/common';
import { CustomerContactsService } from './customer_contacts.service';
import { CustomerContactsController } from './customer_contacts.controller';
import { PrismaModule } from '../prisma/prisma.module'; // افتراض وجود PrismaModule في مسار '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [CustomerContactsController],
  providers: [CustomerContactsService],
})
export class CustomerContactsModule {}
