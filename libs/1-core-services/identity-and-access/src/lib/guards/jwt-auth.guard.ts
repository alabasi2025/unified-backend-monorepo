/**
 * SEMOP - JWT Auth Guard
 * حارس المصادقة باستخدام JWT
 * 
 * @module JwtAuthGuard
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * التحقق من إمكانية الوصول
   * @param context سياق التنفيذ
   * @returns true إذا كان مسموح بالوصول
   */
  canActivate(context: ExecutionContext) {
    // التحقق من وجود @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
