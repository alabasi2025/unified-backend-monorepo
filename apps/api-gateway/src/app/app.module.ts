/**
 * PHASE 10: Clean Architecture - All modules from libs/
 * Following strict rules: all business logic in libs/, apps/ is thin layer only
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Layer 0: Shared Services
import { PrismaModule } from '../../../../libs/0-shared/prisma/prisma.module';

// Layer 1: Core Services
import { AuthModule } from '../../../../libs/1-core-services/auth/auth.module';
import { RolesModule } from '../../../../libs/1-core-services/roles/roles.module';
import { PermissionsModule } from '../../../../libs/1-core-services/permissions/permissions.module';
import { RolePermissionsModule } from '../../../../libs/1-core-services/role-permissions/role-permissions.module';
import { DashboardModule } from '../../../../libs/1-core-services/dashboard/dashboard.module';
import { OrganizationalStructureModule } from '../../../../libs/1-core-services/organizational-structure/organizational-structure.module';

// Layer 2: OCMP
import { GenesModule } from '../../../../libs/2-ocmp/genes/genes.module';
import { HoldingsModule } from '../../../../libs/2-ocmp/holdings/holdings.module';
import { LatitudePointsModule } from '../../../../libs/2-ocmp/latitude-points/latitude-points.module';

// Layer 3: Vertical Applications - Accounting
import { AccountsModule } from '../../../../libs/3-vertical-applications/accounting/accounts/accounts.module';
import { AccountHierarchyModule } from '../../../../libs/3-vertical-applications/accounting/account-hierarchy/account-hierarchy.module';
import { FiscalYearsModule } from '../../../../libs/3-vertical-applications/accounting/fiscal-years/fiscal-years.module';
import { FiscalPeriodsModule } from '../../../../libs/3-vertical-applications/accounting/fiscal-periods/fiscal-periods.module';
import { CostCentersModule } from '../../../../libs/3-vertical-applications/accounting/cost-centers/cost-centers.module';
import { JournalEntriesModule } from '../../../../libs/3-vertical-applications/accounting/journal-entries/journal-entries.module';

// Layer 3: Vertical Applications - Inventory
import { ItemsModule } from '../../../../libs/3-vertical-applications/inventory/items/items.module';

// Layer 3: Vertical Applications - Purchasing
import { SuppliersModule } from '../../../../libs/3-vertical-applications/purchasing/suppliers/suppliers.module';
import { PurchaseOrdersModule } from '../../../../libs/3-vertical-applications/purchasing/purchase-orders/purchase-orders.module';

// Layer 3: Vertical Applications - Sales
import { CustomersModule } from '../../../../libs/3-vertical-applications/sales/customers/customers.module';
import { CustomerContactsModule } from '../../../../libs/3-vertical-applications/sales/customer-contacts/customer-contacts.module';

// Layer 3: Vertical Applications - Projects
import { ProjectsModule } from '../../../../libs/3-vertical-applications/projects/projects/projects.module';

@Module({
  imports: [
    // Layer 0: Shared
    PrismaModule,
    // Layer 1: Core Services
    AuthModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    DashboardModule,
    OrganizationalStructureModule,
    
    // Layer 2: OCMP
    GenesModule,
    HoldingsModule,
    LatitudePointsModule,
    
    // Layer 3: Accounting
    AccountsModule,
    AccountHierarchyModule,
    FiscalYearsModule,
    FiscalPeriodsModule,
    CostCentersModule,
    JournalEntriesModule,
    
    // Layer 3: Inventory
    ItemsModule,
    
    // Layer 3: Purchasing
    SuppliersModule,
    PurchaseOrdersModule,
    
    // Layer 3: Sales
    CustomersModule,
    CustomerContactsModule,
    
    // Layer 3: Projects
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// Dummy APIs for quick testing
import * as express from 'express';
const dummyRouter = require('../dummy-apis');
