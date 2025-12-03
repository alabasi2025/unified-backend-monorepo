// PHASE 10: Role Permissions Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';

@Injectable()
export class RolePermissionsService {
  constructor(private prisma: PrismaService) {}
}
