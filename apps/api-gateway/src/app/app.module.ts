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
import { SmartNotebookModule } from '../modules/smart-notebook/smart-notebook.module';
import { ReportsModule } from '../modules/reports/reports.module';
import { SearchModule } from '../modules/search/search.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';

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
    SmartNotebookModule,
    ReportsModule,
    SearchModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
