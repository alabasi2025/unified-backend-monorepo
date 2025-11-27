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
import { ReportsModule } from '../modules/reports/reports.module';
import { SalesOrdersModule } from '../modules/sales-orders/sales-orders.module';
import { MagicNotebookModule } from "../magic-notebook/magic-notebook.module";
// Cycle 4 - New Modules (Prisma-based)
import { GenesModule } from './genes/genes.module';
import { LatitudePointsModule } from './latitude-points/latitude-points.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { AccountHierarchyModule } from './account-hierarchy/account-hierarchy.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { CustomerContactsModule } from './customer-contacts/customer-contacts.module';
// v2.3.0 - New Modules
import { BillingModule } from '../billing/billing.module';
import { WalletModule } from '../wallet/wallet.module';
import { AssetsModule } from '../assets/assets.module';
import { ScmModule } from '../scm/scm.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ConfigurationModule } from '../configuration/configuration.module';

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
    ReportsModule,
    SalesOrdersModule,
    MagicNotebookModule,
    // Cycle 4 - New Modules
    GenesModule,
    LatitudePointsModule,
    PurchaseOrdersModule,
    AccountHierarchyModule,
    RolePermissionsModule,
    CustomerContactsModule,
    // v2.3.0 - New Modules
    BillingModule,
    WalletModule,
    AssetsModule,
    ScmModule,
    NotificationsModule,
    ConfigurationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// Dummy APIs for quick testing
import * as express from 'express';
const dummyRouter = require('../dummy-apis');
