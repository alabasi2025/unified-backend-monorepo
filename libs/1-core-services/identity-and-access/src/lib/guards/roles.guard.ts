/**
 * SEMOP - Roles Guard
 * حارس الأدوار
 * 
 * @module RolesGuard
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../services/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * التحقق من إمكانية الوصول بناءً على الأدوار
   * @param context سياق التنفيذ
   * @returns true إذا كان لديه الأدوار المطلوبة
   */
  canActivate(context: ExecutionContext): boolean {
    // الحصول على الأدوار المطلوبة من الـ decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // الحصول على المستخدم من الـ request
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // التحقق من أن المستخدم لديه أي من الأدوار المطلوبة
    const hasAnyRole = requiredRoles.some(role =>
      user.roles.includes(role)
    );

    if (!hasAnyRole) {
      throw new ForbiddenException('Insufficient roles');
    }

    return true;
  }
}
