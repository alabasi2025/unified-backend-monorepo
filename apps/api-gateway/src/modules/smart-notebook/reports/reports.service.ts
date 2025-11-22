import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateReportDto, UpdateReportDto, FilterReportsDto, ImportReportDto } from './dto/reports.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * إضافة تقرير جديد
   */
  async create(createReportDto: CreateReportDto, userId: string) {
    return this.prisma.report.create({
      data: {
        ...createReportDto,
        createdBy: userId,
      },
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * استيراد تقرير من ملف
   */
  async import(importReportDto: ImportReportDto, userId: string) {
    const { filePath, sourceRepo, sourceFile } = importReportDto;

    try {
      // Read file content
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);

      // Extract title from first line or filename
      const lines = content.split('\n');
      const title = lines[0]?.replace(/^#\s*/, '') || path.basename(sourceFile || filePath);

      // Determine report type from filename
      let type = 'OTHER';
      const filename = (sourceFile || filePath).toLowerCase();
      if (filename.includes('achievement') || filename.includes('إنجاز')) type = 'ACHIEVEMENT';
      else if (filename.includes('phase') || filename.includes('مرحلة')) type = 'PHASE';
      else if (filename.includes('update') || filename.includes('تحديث')) type = 'UPDATE';
      else if (filename.includes('analysis') || filename.includes('تحليل')) type = 'ANALYSIS';

      return this.prisma.report.create({
        data: {
          title,
          content,
          type: type as any,
          category: importReportDto.category || 'imported',
          tags: importReportDto.tags || [],
          sourceRepo,
          sourceFile,
          sourcePath: filePath,
          fileSize: stats.size,
          importedAt: new Date(),
          createdBy: userId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to import report: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع التقارير مع التصفية
   */
  async findAll(filter: FilterReportsDto) {
    const {
      type,
      category,
      sourceRepo,
      search,
      status,
      format,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filter;

    const where: any = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (sourceRepo) where.sourceRepo = sourceRepo;
    if (status) where.status = status;
    if (format) where.format = format;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          page: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * الحصول على تقرير واحد
   */
  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  /**
   * تحديث تقرير
   */
  async update(id: string, updateReportDto: UpdateReportDto, userId: string) {
    await this.findOne(id);

    return this.prisma.report.update({
      where: { id },
      data: {
        ...updateReportDto,
        updatedBy: userId,
      },
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * حذف تقرير
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.report.delete({
      where: { id },
    });
  }

  /**
   * الحصول على إحصائيات التقارير
   */
  async getStatistics() {
    const [
      total,
      imported,
      byType,
      byCategory,
      bySourceRepo,
      recentReports,
      totalSize,
    ] = await Promise.all([
      this.prisma.report.count(),
      this.prisma.report.count({ where: { importedAt: { not: null } } }),
      this.prisma.report.groupBy({
        by: ['type'],
        _count: true,
      }),
      this.prisma.report.groupBy({
        by: ['category'],
        _count: true,
      }),
      this.prisma.report.groupBy({
        by: ['sourceRepo'],
        _count: true,
        where: { sourceRepo: { not: null } },
      }),
      this.prisma.report.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          category: true,
          createdAt: true,
        },
      }),
      this.prisma.report.aggregate({
        _sum: {
          fileSize: true,
        },
      }),
    ]);

    return {
      total,
      imported,
      totalSize: totalSize._sum.fileSize || 0,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
      byCategory: byCategory.reduce((acc, item) => {
        acc[item.category] = item._count;
        return acc;
      }, {}),
      bySourceRepo: bySourceRepo.reduce((acc, item) => {
        if (item.sourceRepo) acc[item.sourceRepo] = item._count;
        return acc;
      }, {}),
      recentReports,
    };
  }

  /**
   * البحث في التقارير
   */
  async search(query: string, limit = 10) {
    return this.prisma.report.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        summary: true,
        type: true,
        category: true,
        sourceRepo: true,
        createdAt: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
