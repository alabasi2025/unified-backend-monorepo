/**
 * SEMOP - Identity and Access Module
 * وحدة نظام الهوية والصلاحيات
 * 
 * @module IdentityAndAccessModule
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MultiEntityModule } from '@semop/multi-entity';

// Services
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { AuthService } from './services/auth.service';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Global()
@Module({
  imports: [
    MultiEntityModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SEMOP_JWT_SECRET_CHANGE_IN_PRODUCTION',
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  controllers: [],
  providers: [
    UserService,
    RoleService,
    PermissionService,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [
    UserService,
    RoleService,
    PermissionService,
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    JwtModule,
    PassportModule,
  ],
})
export class IdentityAndAccessModule {}
