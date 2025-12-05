import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import { CreateItemCategoryDto, UpdateItemCategoryDto } from './item-categories.dto';

@Injectable()
export class ItemCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.itemCategory.findMany({
      orderBy: { nameAr: 'asc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.itemCategory.findUnique({ where: { id } });
  }

  async create(data: CreateItemCategoryDto) {
    return this.prisma.itemCategory.create({ data });
  }

  async update(id: string, data: UpdateItemCategoryDto) {
    return this.prisma.itemCategory.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.itemCategory.delete({ where: { id } });
  }
}
