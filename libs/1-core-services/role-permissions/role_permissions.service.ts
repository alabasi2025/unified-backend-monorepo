// PHASE 10: Role Permissions Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../0-shared/prisma/prisma.service';

@Injectable()
export class RolePermissionsService {
  constructor(private prisma: PrismaService) {}
}
