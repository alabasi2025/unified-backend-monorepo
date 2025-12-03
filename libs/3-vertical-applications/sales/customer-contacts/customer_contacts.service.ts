// PHASE 10: Customer Contacts Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../0-shared/prisma/prisma.service';

@Injectable()
export class CustomerContactsService {
  constructor(private prisma: PrismaService) {}
}
