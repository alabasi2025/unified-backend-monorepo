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

  /**
   * ربط الجين بقطاع معين
   * @param id معرف الجين
   * @param sectorCode رمز القطاع
   */
  async linkGeneToSector(id: number, sectorCode: string) {
    try {
      return await this.prisma.gene.update({
        where: { id },
        data: { sectorCode },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Gene with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * الحصول على جميع الجينات المرتبطة بقطاع معين
   * @param sectorCode رمز القطاع
   */
  async getGenesBySector(sectorCode: string) {
    return this.prisma.gene.findMany({
      where: { sectorCode },
      include: {
        modules: true, // تضمين الوحدات المرتبطة بالجين
      },
    });
  }

  /**
   * الحصول على الجينات النشطة
   */
  async getActiveGenes() {
    return this.prisma.gene.findMany({
      where: { isActive: true },
      include: {
        modules: true,
      },
    });
  }

  /**
   * الحصول على جميع القطاعات
   */
  async getAllSectors() {
    // هذا مثال افتراضي - يجب إنشاء جدول Sector في قاعدة البيانات
    return [
      { id: '1', code: 'GENERAL', nameAr: 'عام', nameEn: 'General', icon: '🏛️', isActive: true },
      { id: '2', code: 'SUPERMARKET', nameAr: 'سوبر ماركت', nameEn: 'Supermarket', icon: '🛒', isActive: true },
      { id: '3', code: 'PHARMACY', nameAr: 'صيدلية', nameEn: 'Pharmacy', icon: '💊', isActive: true },
      { id: '4', code: 'RESTAURANT', nameAr: 'مطعم', nameEn: 'Restaurant', icon: '🍴', isActive: true },
      { id: '5', code: 'HOSPITAL', nameAr: 'مستشفى', nameEn: 'Hospital', icon: '🏥', isActive: true },
    ];
  }

  /**
   * تفعيل جين معين
   */
  async activateGene(id: number, performedBy?: string, reason?: string) {
    try {
      const gene = await this.prisma.gene.update({
        where: { id },
        data: { isActive: true },
      });

      // تسجيل التاريخ
      await this.logActivationHistory(id.toString(), 'ACTIVATED', performedBy, reason);

      return gene;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Gene with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * تعطيل جين معين
   */
  async deactivateGene(id: number, performedBy?: string, reason?: string) {
    try {
      const gene = await this.prisma.gene.update({
        where: { id },
        data: { isActive: false },
      });

      // تسجيل التاريخ
      await this.logActivationHistory(id.toString(), 'DEACTIVATED', performedBy, reason);

      return gene;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Gene with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * تسجيل تاريخ تفعيل/تعطيل الجين
   */
  private async logActivationHistory(
    geneId: string,
    action: string,
    performedBy?: string,
    reason?: string,
  ) {
    try {
      await this.prisma.geneActivationHistory.create({
        data: {
          geneId,
          action,
          performedBy,
          reason,
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'api',
          },
        },
      });
    } catch (error) {
      // تسجيل الخطأ لكن لا نوقف العملية
      console.error('Failed to log activation history:', error);
    }
  }

  /**
   * الحصول على تاريخ التفعيل/التعطيل لجين معين
   */
  async getGeneHistory(geneId: string) {
    return this.prisma.geneActivationHistory.findMany({
      where: { geneId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * إضافة اعتمادية بين جينين
   */
  async addDependency(
    geneId: string,
    dependsOnGeneId: string,
    dependencyType: string,
    description?: string,
  ) {
    return this.prisma.geneDependency.create({
      data: {
        geneId,
        dependsOnGeneId,
        dependencyType,
        description,
      },
    });
  }

  /**
   * الحصول على اعتماديات جين معين
   */
  async getGeneDependencies(geneId: string) {
    return this.prisma.geneDependency.findMany({
      where: { geneId },
    });
  }

  /**
   * التحقق من إمكانية تفعيل جين (بناءً على الاعتماديات)
   */
  async canActivateGene(geneId: string): Promise<{ canActivate: boolean; missingDependencies: string[] }> {
    const dependencies = await this.prisma.geneDependency.findMany({
      where: {
        geneId,
        dependencyType: 'REQUIRED',
      },
    });

    const missingDependencies: string[] = [];

    for (const dep of dependencies) {
      const dependentGene = await this.prisma.gene.findUnique({
        where: { id: parseInt(dep.dependsOnGeneId) },
      });

      if (!dependentGene || !dependentGene.isActive) {
        missingDependencies.push(dep.dependsOnGeneId);
      }
    }

    return {
      canActivate: missingDependencies.length === 0,
      missingDependencies,
    };
  }

  /**
   * تقرير استخدام الجينات
   */
  async getUsageReport() {
    const totalGenes = await this.prisma.gene.count();
    const activeGenes = await this.prisma.gene.count({ where: { isActive: true } });
    const inactiveGenes = totalGenes - activeGenes;

    const genesByCategory = await this.prisma.gene.groupBy({
      by: ['category'],
      _count: true,
    });

    const recentActivations = await this.prisma.geneActivationHistory.findMany({
      where: { action: 'ACTIVATED' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      summary: {
        total: totalGenes,
        active: activeGenes,
        inactive: inactiveGenes,
        activationRate: totalGenes > 0 ? (activeGenes / totalGenes) * 100 : 0,
      },
      byCategory: genesByCategory,
      recentActivations,
    };
  }
}
