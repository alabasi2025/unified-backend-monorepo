import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { HoldingsModule } from './holdings/holdings.module';
import { UnitsModule } from './units/units.module';
import { ProjectsModule } from './projects/projects.module';
import { CustomersModule } from './customers/customers.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ItemsModule } from './items/items.module';
import { DocumentationModule } from '../modules/documentation/documentation.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DashboardModule,
    RolesModule,
    PermissionsModule,
    HoldingsModule,
    UnitsModule,
    ProjectsModule,
    CustomersModule,
    SuppliersModule,
    ItemsModule,
    DocumentationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
