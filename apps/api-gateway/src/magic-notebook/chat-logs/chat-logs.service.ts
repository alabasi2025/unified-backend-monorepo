import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatLogDto } from './dto/create-chat-log.dto';
import { UpdateChatLogDto } from './dto/update-chat-log.dto';

@Injectable()
export class ChatLogsService {
  // حقن PrismaService للتعامل مع قاعدة البيانات
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء سجل محادثة جديد
   * @param createChatLogDto بيانات سجل المحادثة الجديدة
   * @returns سجل المحادثة المنشأ
   */
  async create(createChatLogDto: CreateChatLogDto) {
    // نفترض أن اسم الـ model في Prisma هو 'chatLog'
    return this.prisma.chatLog.create({
      data: createChatLogDto,
    });
  }

  /**
   * استرداد جميع سجلات المحادثات
   * @returns قائمة بسجلات المحادثات
   */
  async findAll() {
    return this.prisma.chatLog.findMany();
  }

  /**
   * استرداد سجل محادثة واحد بواسطة المعرّف (ID)
   * @param id معرّف سجل المحادثة
   * @returns سجل المحادثة
   * @throws NotFoundException إذا لم يتم العثور على السجل
   */
  async findOne(id: string) {
    const chatLog = await this.prisma.chatLog.findUnique({
      where: { id },
    });

    if (!chatLog) {
      throw new NotFoundException(`ChatLog with ID ${id} not found`);
    }

    return chatLog;
  }

  /**
   * تحديث سجل محادثة موجود
   * @param id معرّف سجل المحادثة المراد تحديثه
   * @param updateChatLogDto بيانات التحديث
   * @returns سجل المحادثة المحدث
   * @throws NotFoundException إذا لم يتم العثور على السجل
   */
  async update(id: string, updateChatLogDto: UpdateChatLogDto) {
    // التحقق أولاً من وجود السجل قبل محاولة التحديث
    await this.findOne(id); 

    return this.prisma.chatLog.update({
      where: { id },
      data: updateChatLogDto,
    });
  }

  /**
   * حذف سجل محادثة
   * @param id معرّف سجل المحادثة المراد حذفه
   * @returns سجل المحادثة المحذوف
   * @throws NotFoundException إذا لم يتم العثور على السجل
   */
  async remove(id: string) {
    // التحقق أولاً من وجود السجل قبل محاولة الحذف
    await this.findOne(id); 

    return this.prisma.chatLog.delete({
      where: { id },
    });
  }
}