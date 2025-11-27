import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gene } from './genes.entity';
import { CreateGeneDto, UpdateGeneDto } from './genes.dto';

@Injectable()
export class GenesService {
  constructor(
    @InjectRepository(Gene)
    private genesRepository: Repository<Gene>,
  ) {}

  /**
   * إنشاء سجل جين جديد
   * @param createGeneDto بيانات إنشاء الجين
   * @returns سجل الجين الذي تم إنشاؤه
   */
  async create(createGeneDto: CreateGeneDto): Promise<Gene> {
    const gene = this.genesRepository.create(createGeneDto);
    return this.genesRepository.save(gene);
  }

  /**
   * استرداد جميع سجلات الجينات
   * @returns قائمة بسجلات الجينات
   */
  async findAll(): Promise<Gene[]> {
    return this.genesRepository.find();
  }

  /**
   * استرداد سجل جين بواسطة المعرف
   * @param id معرف الجين
   * @returns سجل الجين
   * @throws NotFoundException إذا لم يتم العثور على الجين
   */
  async findOne(id: number): Promise<Gene> {
    const gene = await this.genesRepository.findOne({ where: { id } });
    if (!gene) {
      throw new NotFoundException(`لم يتم العثور على الجين بالمعرف ${id}`);
    }
    return gene;
  }

  /**
   * تحديث سجل جين موجود
   * @param id معرف الجين
   * @param updateGeneDto بيانات التحديث
   * @returns سجل الجين المحدث
   * @throws NotFoundException إذا لم يتم العثور على الجين
   */
  async update(id: number, updateGeneDto: UpdateGeneDto): Promise<Gene> {
    const gene = await this.findOne(id); // التحقق من وجود الجين
    this.genesRepository.merge(gene, updateGeneDto);
    return this.genesRepository.save(gene);
  }

  /**
   * حذف سجل جين (Soft Delete)
   * @param id معرف الجين
   * @returns نتيجة الحذف
   * @throws NotFoundException إذا لم يتم العثور على الجين
   */
  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.genesRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`لم يتم العثور على الجين بالمعرف ${id} للحذف`);
    }
    return { deleted: true };
  }
}
