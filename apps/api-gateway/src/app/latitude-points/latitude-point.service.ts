import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LatitudePoint } from './latitude_point.entity';
import { CreateLatitudePointDto } from '@semop/contracts';
import { UpdateLatitudePointDto } from '@semop/contracts';

@Injectable()
export class LatitudePointService {
  constructor(
    @InjectRepository(LatitudePoint)
    private latitudePointRepository: Repository<LatitudePoint>,
  ) {}

  /**
   * إنشاء نقطة خط عرض جديدة.
   * @param createLatitudePointDto بيانات نقطة خط العرض الجديدة.
   * @returns نقطة خط العرض التي تم إنشاؤها.
   */
  async create(createLatitudePointDto: CreateLatitudePointDto): Promise<LatitudePoint> {
    const latitudePoint = this.latitudePointRepository.create(createLatitudePointDto);
    return this.latitudePointRepository.save(latitudePoint);
  }

  /**
   * الحصول على جميع نقاط خطوط العرض.
   * @returns قائمة بنقاط خطوط العرض.
   */
  async findAll(): Promise<LatitudePoint[]> {
    return this.latitudePointRepository.find();
  }

  /**
   * الحصول على نقطة خط عرض واحدة بواسطة المعرف.
   * @param id معرف نقطة خط العرض.
   * @returns نقطة خط العرض.
   * @throws NotFoundException إذا لم يتم العثور على النقطة.
   */
  async findOne(id: number): Promise<LatitudePoint> {
    const latitudePoint = await this.latitudePointRepository.findOne({ where: { id } });
    if (!latitudePoint) {
      throw new NotFoundException(`نقطة خط العرض بالمعرف ${id} غير موجودة.`);
    }
    return latitudePoint;
  }

  /**
   * تحديث نقطة خط عرض موجودة.
   * @param id معرف نقطة خط العرض.
   * @param updateLatitudePointDto البيانات المراد تحديثها.
   * @returns نقطة خط العرض المحدثة.
   * @throws NotFoundException إذا لم يتم العثور على النقطة.
   */
  async update(id: number, updateLatitudePointDto: UpdateLatitudePointDto): Promise<LatitudePoint> {
    const latitudePoint = await this.findOne(id); // التحقق من وجود النقطة
    this.latitudePointRepository.merge(latitudePoint, updateLatitudePointDto);
    return this.latitudePointRepository.save(latitudePoint);
  }

  /**
   * حذف نقطة خط عرض.
   * @param id معرف نقطة خط العرض.
   * @returns نقطة خط العرض المحذوفة.
   * @throws NotFoundException إذا لم يتم العثور على النقطة.
   */
  async remove(id: number): Promise<LatitudePoint> {
    const latitudePoint = await this.findOne(id); // التحقق من وجود النقطة
    await this.latitudePointRepository.delete(id);
    return latitudePoint;
  }
}
