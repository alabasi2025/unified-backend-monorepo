import { Injectable } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { CreateItemCategoryDto, UpdateItemCategoryDto } from './item-categories.dto';

@Injectable()
export class ItemCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.itemCategory.findMany({
      orderBy: { nameAr: 'asc' }
    });
  }

  async findOne(id: number) {
    return this.prisma.itemCategory.findUnique({ where: { id } });
  }

  async create(data: CreateItemCategoryDto) {
    return this.prisma.itemCategory.create({ data });
  }

  async update(id: number, data: UpdateItemCategoryDto) {
    return this.prisma.itemCategory.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.itemCategory.delete({ where: { id } });
  }
}
