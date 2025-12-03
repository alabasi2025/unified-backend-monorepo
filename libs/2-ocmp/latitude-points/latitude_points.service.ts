// PHASE 10: Latitude Points Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';

@Injectable()
export class LatitudePointsService {
  constructor(private prisma: PrismaService) {}
}
