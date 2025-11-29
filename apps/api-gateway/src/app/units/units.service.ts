import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
  ) {}

  // إنشاء وحدة جديدة
  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const existingUnit = await this.unitsRepository.findOne({ where: { name: createUnitDto.name } });
    if (existingUnit) {
      throw new ConflictException(`Unit with name "${createUnitDto.name}" already exists.`);
    }

    const unit = this.unitsRepository.create(createUnitDto);
    return this.unitsRepository.save(unit);
  }

  // الحصول على جميع الوحدات
  findAll(): Promise<Unit[]> {
    return this.unitsRepository.find();
  }

  // الحصول على وحدة واحدة بواسطة ID
  async findOne(id: string): Promise<Unit> {
    const unit = await this.unitsRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException(`Unit with ID "${id}" not found.`);
    }
    return unit;
  }

  // تحديث وحدة موجودة
  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.findOne(id); // التحقق من وجود الوحدة

    // التحقق من تكرار الاسم إذا تم تحديثه
    if (updateUnitDto.name && updateUnitDto.name !== unit.name) {
      const existingUnit = await this.unitsRepository.findOne({ where: { name: updateUnitDto.name } });
      if (existingUnit && existingUnit.id !== id) {
        throw new ConflictException(`Unit with name "${updateUnitDto.name}" already exists.`);
      }
    }

    this.unitsRepository.merge(unit, updateUnitDto);
    return this.unitsRepository.save(unit);
  }

  // حذف وحدة (Soft Delete)
  async remove(id: string): Promise<void> {
    const result = await this.unitsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Unit with ID "${id}" not found.`);
    }
  }

  // استعادة وحدة محذوفة (Restore)
  async restore(id: string): Promise<Unit> {
    const result = await this.unitsRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Unit with ID "${id}" not found or not soft-deleted.`);
    }
    return this.findOne(id);
  }
}
