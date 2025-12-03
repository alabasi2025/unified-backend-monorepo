// PHASE 10: Latitude Points Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../0-shared/prisma/prisma.service';

@Injectable()
export class LatitudePointsService {
  constructor(private prisma: PrismaService) {}
}
