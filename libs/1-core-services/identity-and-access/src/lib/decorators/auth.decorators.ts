/**
 * SEMOP - Auth Decorators
 * مُزخرفات المصادقة والتوثيق
 * 
 * @module AuthDecorators
 * @version 0.2.0
 * @date 2025-11-20
 */

import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../services/auth.service';

/**
 * Public Decorator
 * يسمح بالوصول بدون مصادقة
 * 
 * @example
 * @Public()
 * @Get('health')
 * getHealth() {
 *   return { status: 'ok' };
 * }
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * Roles Decorator
 * يحدد الأدوار المطلوبة للوصول
 * 
 * @param roles قائمة أكواد الأدوار
 * @example
 * @Roles('SUPER_ADMIN', 'HOLDING_ADMIN')
 * @Get('admin')
 * getAdminData() {
 *   return { data: 'admin data' };
 * }
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * Permissions Decorator
 * يحدد الصلاحيات المطلوبة للوصول
 * 
 * @param permissions قائمة أكواد الصلاحيات
 * @example
 * @Permissions('USERS_CREATE', 'USERS_UPDATE')
 * @Post('users')
 * createUser() {
 *   return { message: 'User created' };
 * }
 */
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

/**
 * CurrentUser Decorator
 * يحصل على المستخدم الحالي من الـ request
 * 
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

/**
 * CurrentUserId Decorator
 * يحصل على معرف المستخدم الحالي من الـ request
 * 
 * @example
 * @Get('my-data')
 * getMyData(@CurrentUserId() userId: string) {
 *   return this.service.findByUserId(userId);
 * }
 */
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.sub;
  }
);
