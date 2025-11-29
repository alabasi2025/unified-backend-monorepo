import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // افتراض وجود PrismaService في هذا المسار
import { CreateGeneDto, UpdateGeneDto } from './dto/genes.dto';

@Injectable()
export class GenesService {
  constructor(private prisma: PrismaService) {}

  async create(createGeneDto: CreateGeneDto) {
    return this.prisma.gene.create({
      data: createGeneDto,
    });
  }

  async findAll() {
    return this.prisma.gene.findMany();
  }

  async findOne(id: number) {
    const gene = await this.prisma.gene.findUnique({
      where: { id },
    });

    if (!gene) {
      throw new NotFoundException(`Gene with ID ${id} not found`);
    }

    return gene;
  }

  async update(id: number, updateGeneDto: UpdateGeneDto) {
    try {
      return await this.prisma.gene.update({
        where: { id },
        data: updateGeneDto,
      });
    } catch (error) {
      // التعامل مع حالة عدم العثور على السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`Gene with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.gene.delete({
        where: { id },
      });
    } catch (error) {
      // التعامل مع حالة عدم العثور على السجل
      if (error.code === 'P2025') {
        throw new NotFoundException(`Gene with ID ${id} not found`);
      }
      throw error;
    }
  }
}
