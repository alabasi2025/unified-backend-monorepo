import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountHierarchy } from './account_hierarchy.entity';
import { AccountHierarchyService } from './account_hierarchy.service';
import { AccountHierarchyController } from './account_hierarchy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountHierarchy])],
  controllers: [AccountHierarchyController],
  providers: [AccountHierarchyService],
  exports: [AccountHierarchyService],
})
export class AccountHierarchyModule {}
