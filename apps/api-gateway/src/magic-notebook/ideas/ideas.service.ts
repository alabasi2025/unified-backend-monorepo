import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';

@Injectable()
export class IdeasService {
  constructor(private prisma: PrismaService) {}

  /**
   * ينشئ فكرة جديدة في قاعدة البيانات.
   * @param createIdeaDto بيانات الفكرة الجديدة.
   * @returns الفكرة المنشأة.
   */
  async create(createIdeaDto: CreateIdeaDto) {
    return this.prisma.idea.create({
      data: createIdeaDto,
    });
  }

  /**
   * يسترجع جميع الأفكار من قاعدة البيانات.
   * @returns قائمة بجميع الأفكار.
   */
  async findAll() {
    return this.prisma.idea.findMany();
  }

  /**
   * يسترجع فكرة واحدة بناءً على الـ ID.
   * @param id معرف الفكرة.
   * @returns الفكرة المطلوبة.
   * @throws NotFoundException إذا لم يتم العثور على الفكرة.
   */
  async findOne(id: string) {
    const idea = await this.prisma.idea.findUnique({
      where: { id },
    });
    if (!idea) {
      throw new NotFoundException(`Idea with ID ${id} not found`);
    }
    return idea;
  }

  /**
   * يحدث فكرة موجودة بناءً على الـ ID.
   * @param id معرف الفكرة المراد تحديثها.
   * @param updateIdeaDto البيانات الجديدة للتحديث.
   * @returns الفكرة المحدثة.
   * @throws NotFoundException إذا لم يتم العثور على الفكرة.
   */
  async update(id: string, updateIdeaDto: UpdateIdeaDto) {
    // التحقق من وجود الفكرة قبل التحديث
    await this.findOne(id); 
    
    return this.prisma.idea.update({
      where: { id },
      data: updateIdeaDto,
    });
  }

  /**
   * يحذف فكرة موجودة بناءً على الـ ID.
   * @param id معرف الفكرة المراد حذفها.
   * @returns الفكرة المحذوفة.
   * @throws NotFoundException إذا لم يتم العثور على الفكرة.
   */
  async remove(id: string) {
    // التحقق من وجود الفكرة قبل الحذف
    await this.findOne(id); 
    
    return this.prisma.idea.delete({
      where: { id },
    });
  }
}