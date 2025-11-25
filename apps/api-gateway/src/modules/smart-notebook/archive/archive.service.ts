// /home/ubuntu/archive-module/service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // افتراض وجود PrismaService
import { CreateArchiveDto } from './dto-create';
import { UpdateArchiveDto } from './dto-update';
import { Archive } from '@prisma/client'; // افتراض أن Prisma Client تم توليده

/**
 * @description خدمة إدارة الأرشفة.
 * تتولى العمليات المنطقية والتفاعل مع قاعدة البيانات عبر Prisma.
 */
@Injectable()
export class ArchiveService {
  constructor(private prisma: PrismaService) {}

  /**
   * @description إنشاء سجل أرشفة جديد.
   * @param createArchiveDto بيانات إنشاء سجل الأرشفة.
   * @returns سجل الأرشفة المُنشأ.
   */
  async create(createArchiveDto: CreateArchiveDto): Promise<Archive> {
    // التحقق من أن archivedBy موجود إذا كانت الأرشفة يدوية
    if (!createArchiveDto.isAutomatic && !createArchiveDto.archivedBy) {
      throw new Error('يجب تحديد المستخدم الذي قام بالأرشفة (archivedBy) للأرشفة اليدوية.');
    }

    // إنشاء سجل الأرشفة في قاعدة البيانات
    return this.prisma.archive.create({
      data: {
        ...createArchiveDto,
        // تحويل isAutomatic إلى boolean صريح إذا لم يتم تمريره
        isAutomatic: createArchiveDto.isAutomatic ?? false,
      },
    });
  }

  /**
   * @description استرداد جميع سجلات الأرشفة.
   * @returns قائمة بسجلات الأرشفة.
   */
  async findAll(): Promise<Archive[]> {
    return this.prisma.archive.findMany();
  }

  /**
   * @description استرداد سجل أرشفة واحد بواسطة المعرف.
   * @param id المعرف الفريد لسجل الأرشفة.
   * @returns سجل الأرشفة.
   * @throws NotFoundException إذا لم يتم العثور على السجل.
   */
  async findOne(id: string): Promise<Archive> {
    const archive = await this.prisma.archive.findUnique({
      where: { id },
    });

    if (!archive) {
      throw new NotFoundException(`لم يتم العثور على سجل أرشفة بالمعرف: ${id}`);
    }
    return archive;
  }

  /**
   * @description تحديث سجل أرشفة موجود.
   * @param id المعرف الفريد لسجل الأرشفة.
   * @param updateArchiveDto بيانات التحديث.
   * @returns سجل الأرشفة المُحدَّث.
   * @throws NotFoundException إذا لم يتم العثور على السجل.
   */
  async update(id: string, updateArchiveDto: UpdateArchiveDto): Promise<Archive> {
    await this.findOne(id); // التحقق من وجود السجل

    return this.prisma.archive.update({
      where: { id },
      data: updateArchiveDto,
    });
  }

  /**
   * @description حذف سجل أرشفة.
   * @param id المعرف الفريد لسجل الأرشفة.
   * @returns سجل الأرشفة المحذوف.
   * @throws NotFoundException إذا لم يتم العثور على السجل.
   */
  async remove(id: string): Promise<Archive> {
    await this.findOne(id); // التحقق من وجود السجل

    return this.prisma.archive.delete({
      where: { id },
    });
  }

  /**
   * @description استرجاع عنصر من الأرشيف (تحديث حقول الاسترجاع).
   * @param id المعرف الفريد لسجل الأرشفة.
   * @param restoredBy المعرف الفريد للمستخدم الذي قام بالاسترجاع.
   * @returns سجل الأرشفة المُحدَّث.
   * @throws NotFoundException إذا لم يتم العثور على السجل.
   */
  async restore(id: string, restoredBy: string): Promise<Archive> {
    await this.findOne(id); // التحقق من وجود السجل

    return this.prisma.archive.update({
      where: { id },
      data: {
        restoredAt: new Date(),
        restoredBy: restoredBy,
      },
    });
  }
}
