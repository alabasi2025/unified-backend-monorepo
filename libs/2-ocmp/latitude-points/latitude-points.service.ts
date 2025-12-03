import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service'; // افتراض وجود PrismaService في هذا المسار
import { CreateLatitudePointDto, UpdateLatitudePointDto } from './dto/latitude_point.dto';

@Injectable()
export class LatitudePointsService {
  constructor(private prisma: PrismaService) {}

  async create(createLatitudePointDto: CreateLatitudePointDto) {
    try {
      return await this.prisma.latitude_points.create({
        data: createLatitudePointDto,
      });
    } catch (error) {
      // يمكن التعامل مع أخطاء فريدة مثل تكرار point_name هنا
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.latitude_points.findMany();
  }

  async findOne(id: number) {
    const point = await this.prisma.latitude_points.findUnique({
      where: { id },
    });

    if (!point) {
      throw new NotFoundException(`Latitude Point with ID ${id} not found`);
    }
    return point;
  }

  async update(id: number, updateLatitudePointDto: UpdateLatitudePointDto) {
    try {
      return await this.prisma.latitude_points.update({
        where: { id },
        data: updateLatitudePointDto,
      });
    } catch (error) {
      // يمكن التعامل مع أخطاء عدم العثور على السجل هنا
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.latitude_points.delete({
        where: { id },
      });
    } catch (error) {
      // يمكن التعامل مع أخطاء عدم العثور على السجل هنا
      throw error;
    }
  }
}
