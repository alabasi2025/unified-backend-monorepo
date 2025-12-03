// PHASE 10: Latitude Points Controller
import { Controller } from '@nestjs/common';
import { LatitudePointsService } from './latitude_points.service';

@Controller('latitude-points')
export class LatitudePointsController {
  constructor(private readonly service: LatitudePointsService) {}
}
