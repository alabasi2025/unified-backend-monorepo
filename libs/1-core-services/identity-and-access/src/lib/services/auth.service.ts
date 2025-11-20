/**
 * SEMOP - Authentication Service
 * خدمة المصادقة والتوثيق
 * 
 * @module AuthService
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';

export interface JwtPayload {
  sub: string; // User ID
  username: string;
  email: string;
  holdingId?: string;
  unitId?: string;
  projectId?: string;
  roles: string[]; // Role codes
  permissions: string[]; // Permission codes
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    holdingId?: string;
    unitId?: string;
    projectId?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * تسجيل الدخول
   * @param emailOrUsername البريد الإلكتروني أو اسم المستخدم
   * @param password كلمة المرور
   * @returns معلومات تسجيل الدخول مع الـ tokens
   */
  async login(emailOrUsername: string, password: string): Promise<LoginResponse> {
    // البحث عن المستخدم
    const user = await this.userService.findForAuthentication(emailOrUsername);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // التحقق من أن المستخدم نشط
    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await this.userService.verifyPassword(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // استخراج الأدوار والصلاحيات
    const roles = user.userRoles.map(ur => ur.role.code);
    const permissions = this.extractPermissions(user);

    // إنشاء JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      holdingId: user.holdingId || undefined,
      unitId: user.unitId || undefined,
      projectId: user.projectId || undefined,
      roles,
      permissions,
    };

    // إنشاء الـ tokens
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m', // 15 دقيقة
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' } // 7 أيام
    );

    // تحديث آخر تسجيل دخول
    await this.userService.updateLastLogin(user.id);

    // إرجاع النتيجة
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || undefined,
        holdingId: user.holdingId || undefined,
        unitId: user.unitId || undefined,
        projectId: user.projectId || undefined,
      },
    };
  }

  /**
   * تحديث الـ Access Token باستخدام Refresh Token
   * @param refreshToken الـ Refresh Token
   * @returns Access Token جديد
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // التحقق من صحة الـ Refresh Token
      const payload = this.jwtService.verify(refreshToken);

      // البحث عن المستخدم
      const user = await this.userService.findForAuthentication(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // استخراج الأدوار والصلاحيات
      const roles = user.userRoles.map(ur => ur.role.code);
      const permissions = this.extractPermissions(user);

      // إنشاء JWT payload جديد
      const newPayload: JwtPayload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        holdingId: user.holdingId || undefined,
        unitId: user.unitId || undefined,
        projectId: user.projectId || undefined,
        roles,
        permissions,
      };

      // إنشاء Access Token جديد
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * التحقق من صحة الـ Access Token
   * @param token الـ Access Token
   * @returns JWT Payload
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * تسجيل الخروج
   * في الوقت الحالي، لا نحتاج إلى فعل شيء لأن JWT stateless
   * في المستقبل، يمكن إضافة blacklist للـ tokens
   */
  async logout(): Promise<void> {
    // TODO: إضافة token blacklist في المستقبل
    return;
  }

  /**
   * استخراج الصلاحيات من بيانات المستخدم
   * @param user المستخدم مع العلاقات
   * @returns قائمة أكواد الصلاحيات
   */
  private extractPermissions(user: any): string[] {
    const permissionsSet = new Set<string>();

    // استخراج الصلاحيات من جميع الأدوار
    for (const userRole of user.userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        permissionsSet.add(rolePermission.permission.code);
      }
    }

    return Array.from(permissionsSet);
  }

  /**
   * التحقق من أن المستخدم لديه صلاحية معينة
   * @param user المستخدم
   * @param permissionCode كود الصلاحية
   * @returns true إذا كان لديه الصلاحية
   */
  hasPermission(user: JwtPayload, permissionCode: string): boolean {
    return user.permissions.includes(permissionCode);
  }

  /**
   * التحقق من أن المستخدم لديه دور معين
   * @param user المستخدم
   * @param roleCode كود الدور
   * @returns true إذا كان لديه الدور
   */
  hasRole(user: JwtPayload, roleCode: string): boolean {
    return user.roles.includes(roleCode);
  }

  /**
   * التحقق من أن المستخدم لديه أي من الأدوار المحددة
   * @param user المستخدم
   * @param roleCodes قائمة أكواد الأدوار
   * @returns true إذا كان لديه أي من الأدوار
   */
  hasAnyRole(user: JwtPayload, roleCodes: string[]): boolean {
    return roleCodes.some(roleCode => this.hasRole(user, roleCode));
  }

  /**
   * التحقق من أن المستخدم لديه جميع الأدوار المحددة
   * @param user المستخدم
   * @param roleCodes قائمة أكواد الأدوار
   * @returns true إذا كان لديه جميع الأدوار
   */
  hasAllRoles(user: JwtPayload, roleCodes: string[]): boolean {
    return roleCodes.every(roleCode => this.hasRole(user, roleCode));
  }
}
