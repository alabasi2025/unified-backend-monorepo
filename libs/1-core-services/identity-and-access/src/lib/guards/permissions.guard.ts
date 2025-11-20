/**
 * SEMOP - Permissions Guard
 * حارس الصلاحيات
 * 
 * @module PermissionsGuard
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../services/auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * التحقق من إمكانية الوصول بناءً على الصلاحيات
   * @param context سياق التنفيذ
   * @returns true إذا كان لديه الصلاحيات المطلوبة
   */
  canActivate(context: ExecutionContext): boolean {
    // الحصول على الصلاحيات المطلوبة من الـ decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // الحصول على المستخدم من الـ request
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // التحقق من أن المستخدم لديه جميع الصلاحيات المطلوبة
    const hasAllPermissions = requiredPermissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
