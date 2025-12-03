// PHASE 10: Account Hierarchy Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../0-shared/prisma/prisma.service';

@Injectable()
export class AccountHierarchyService {
  constructor(private prisma: PrismaService) {}
}
