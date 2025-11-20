/**
 * SEMOP - User Service
 * خدمة إدارة المستخدمين
 * 
 * @module UserService
 * @version 0.2.0
 * @date 2025-11-20
 */

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '@semop/multi-entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * إنشاء مستخدم جديد
   * @param data بيانات المستخدم
   * @param password كلمة المرور (نص عادي)
   * @param createdBy معرف المستخدم الذي أنشأ السجل
   * @returns المستخدم المُنشأ (بدون كلمة المرور)
   */
  async create(
    data: Omit<Prisma.UserCreateInput, 'passwordHash'>,
    password: string,
    createdBy?: string
  ): Promise<Omit<User, 'passwordHash'>> {
    // التحقق من قوة كلمة المرور
    this.validatePassword(password);

    // تشفير كلمة المرور
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          passwordHash,
          createdBy,
        },
      });

      // إزالة كلمة المرور من النتيجة
      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const field = (error.meta?.target as string[])?.[0];
          throw new ConflictException(`${field} already exists`);
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Related entity not found');
        }
      }
      throw error;
    }
  }

  /**
   * البحث عن جميع المستخدمين
   * @param params معايير البحث والترتيب
   * @returns قائمة المستخدمين (بدون كلمات المرور)
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude;
  } = {}): Promise<Omit<User, 'passwordHash'>[]> {
    const { skip, take, where, orderBy, include } = params;

    const users = await this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
      include,
    });

    return users.map(({ passwordHash: _, ...user }) => user);
  }

  /**
   * البحث عن مستخدم واحد
   * @param id معرف المستخدم
   * @param include العلاقات المطلوبة
   * @returns المستخدم (بدون كلمة المرور)
   */
  async findOne(
    id: string,
    include?: Prisma.UserInclude
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * البحث عن مستخدم بالبريد الإلكتروني
   * @param email البريد الإلكتروني
   * @param include العلاقات المطلوبة
   * @returns المستخدم (بدون كلمة المرور)
   */
  async findByEmail(
    email: string,
    include?: Prisma.UserInclude
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include,
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * البحث عن مستخدم باسم المستخدم
   * @param username اسم المستخدم
   * @param include العلاقات المطلوبة
   * @returns المستخدم (بدون كلمة المرور)
   */
  async findByUsername(
    username: string,
    include?: Prisma.UserInclude
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include,
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * البحث عن مستخدم للمصادقة (يتضمن كلمة المرور)
   * ⚠️ للاستخدام الداخلي فقط في عملية المصادقة
   * @param emailOrUsername البريد الإلكتروني أو اسم المستخدم
   * @returns المستخدم (مع كلمة المرور المشفرة)
   */
  async findForAuthentication(emailOrUsername: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * تحديث مستخدم
   * @param id معرف المستخدم
   * @param data البيانات المحدثة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns المستخدم المُحدث (بدون كلمة المرور)
   */
  async update(
    id: string,
    data: Prisma.UserUpdateInput,
    updatedBy?: string
  ): Promise<Omit<User, 'passwordHash'>> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...data,
          updatedBy,
        },
      });

      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          const field = (error.meta?.target as string[])?.[0];
          throw new ConflictException(`${field} already exists`);
        }
      }
      throw error;
    }
  }

  /**
   * تغيير كلمة المرور
   * @param id معرف المستخدم
   * @param oldPassword كلمة المرور القديمة
   * @param newPassword كلمة المرور الجديدة
   * @returns المستخدم المُحدث (بدون كلمة المرور)
   */
  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<Omit<User, 'passwordHash'>> {
    // البحث عن المستخدم مع كلمة المرور
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // التحقق من كلمة المرور القديمة
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    // التحقق من قوة كلمة المرور الجديدة
    this.validatePassword(newPassword);

    // تشفير كلمة المرور الجديدة
    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // تحديث كلمة المرور
    return this.update(id, { passwordHash });
  }

  /**
   * إعادة تعيين كلمة المرور (من قبل المدير)
   * @param id معرف المستخدم
   * @param newPassword كلمة المرور الجديدة
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns المستخدم المُحدث (بدون كلمة المرور)
   */
  async resetPassword(
    id: string,
    newPassword: string,
    updatedBy?: string
  ): Promise<Omit<User, 'passwordHash'>> {
    // التحقق من قوة كلمة المرور
    this.validatePassword(newPassword);

    // تشفير كلمة المرور
    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // تحديث كلمة المرور
    return this.update(id, { passwordHash }, updatedBy);
  }

  /**
   * تحديث آخر تسجيل دخول
   * @param id معرف المستخدم
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * حذف مستخدم
   * @param id معرف المستخدم
   * @returns المستخدم المحذوف (بدون كلمة المرور)
   */
  async remove(id: string): Promise<Omit<User, 'passwordHash'>> {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });

      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  /**
   * تعطيل مستخدم (Soft Delete)
   * @param id معرف المستخدم
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns المستخدم المُعطل (بدون كلمة المرور)
   */
  async deactivate(id: string, updatedBy?: string): Promise<Omit<User, 'passwordHash'>> {
    return this.update(id, { isActive: false }, updatedBy);
  }

  /**
   * تفعيل مستخدم
   * @param id معرف المستخدم
   * @param updatedBy معرف المستخدم الذي عدّل السجل
   * @returns المستخدم المُفعل (بدون كلمة المرور)
   */
  async activate(id: string, updatedBy?: string): Promise<Omit<User, 'passwordHash'>> {
    return this.update(id, { isActive: true }, updatedBy);
  }

  /**
   * تفعيل البريد الإلكتروني
   * @param id معرف المستخدم
   * @returns المستخدم المُحدث (بدون كلمة المرور)
   */
  async verifyEmail(id: string): Promise<Omit<User, 'passwordHash'>> {
    return this.update(id, { isEmailVerified: true });
  }

  /**
   * عد المستخدمين
   * @param where معايير البحث
   * @returns عدد المستخدمين
   */
  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }

  /**
   * التحقق من صحة كلمة المرور
   * @param password كلمة المرور
   * @throws BadRequestException إذا كانت كلمة المرور ضعيفة
   */
  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    // يجب أن تحتوي على حرف كبير واحد على الأقل
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }

    // يجب أن تحتوي على حرف صغير واحد على الأقل
    if (!/[a-z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one lowercase letter');
    }

    // يجب أن تحتوي على رقم واحد على الأقل
    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one number');
    }

    // يجب أن تحتوي على رمز خاص واحد على الأقل
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new BadRequestException('Password must contain at least one special character');
    }
  }

  /**
   * التحقق من كلمة المرور
   * @param password كلمة المرور (نص عادي)
   * @param passwordHash كلمة المرور المشفرة
   * @returns true إذا كانت كلمة المرور صحيحة
   */
  async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
