/**
 * PHASE 10: Organizational Structure Development
 * Module for organizational structure
 */

import { Module } from '@nestjs/common';
import { OrganizationalStructureController } from './organizational-structure.controller';
import { OrganizationalStructureService } from './organizational-structure.service';

@Module({
  controllers: [OrganizationalStructureController],
  providers: [OrganizationalStructureService],
  exports: [OrganizationalStructureService],
})
export class OrganizationalStructureModule {}
