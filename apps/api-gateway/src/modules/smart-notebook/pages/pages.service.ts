import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePageDto, UpdatePageDto, FilterPagesDto } from './dto/pages.dto';
import { PageStatus } from '@prisma/client';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPageDto: CreatePageDto, userId: string) {
    return this.prisma.documentationPage.create({
      data: {
        ...createPageDto,
        createdBy: userId,
      },
      include: {
        parent: { select: { id: true, title: true, slug: true } },
        children: { select: { id: true, title: true, slug: true } },
      },
    });
  }

  async findAll(filter: FilterPagesDto) {
    const { type, category, status, isPublished, isFavorite, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = filter;
    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (status) where.status = status;
    if (isPublished !== undefined) where.isPublished = isPublished;
    if (isFavorite !== undefined) where.isFavorite = isFavorite;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [pages, total] = await Promise.all([
      this.prisma.documentationPage.findMany({
        where,
        include: {
          parent: { select: { id: true, title: true, slug: true } },
          children: { select: { id: true, title: true, slug: true } },
          tasks: { select: { id: true, title: true, status: true } },
          ideas: { select: { id: true, title: true, status: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.documentationPage.count({ where }),
    ]);

    return { pages, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const page = await this.prisma.documentationPage.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        tasks: true,
        ideas: true,
        chatLogs: true,
        reports: true,
        links: { include: { toPage: { select: { id: true, title: true, slug: true } } } },
        history: { orderBy: { createdAt: 'desc' }, take: 10 },
        comments: { where: { parentId: null }, include: { replies: true } },
      },
    });
    if (!page) throw new NotFoundException(`Page ${id} not found`);
    return page;
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.documentationPage.findUnique({
      where: { slug },
      include: {
        parent: { select: { id: true, title: true, slug: true } },
        children: { select: { id: true, title: true, slug: true } },
        tasks: { select: { id: true, title: true, status: true } },
      },
    });
    if (!page) throw new NotFoundException(`Page with slug ${slug} not found`);
    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto, userId: string) {
    await this.findOne(id);
    return this.prisma.documentationPage.update({
      where: { id },
      data: { ...updatePageDto, updatedBy: userId },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.documentationPage.delete({ where: { id } });
  }

  async toggleFavorite(id: string) {
    const page = await this.findOne(id);
    return this.prisma.documentationPage.update({
      where: { id },
      data: { isFavorite: !page.isFavorite },
    });
  }

  async publish(id: string, userId: string) {
    return this.prisma.documentationPage.update({
      where: { id },
      data: { isPublished: true, status: PageStatus.PUBLISHED, updatedBy: userId },
    });
  }

  async getStatistics() {
    const [total, published, byType, byStatus] = await Promise.all([
      this.prisma.documentationPage.count(),
      this.prisma.documentationPage.count({ where: { isPublished: true } }),
      this.prisma.documentationPage.groupBy({ by: ['type'], _count: true }),
      this.prisma.documentationPage.groupBy({ by: ['status'], _count: true }),
    ]);

    return {
      total,
      published,
      byType: byType.reduce((acc, i) => ({ ...acc, [i.type]: i._count }), {}),
      byStatus: byStatus.reduce((acc, i) => ({ ...acc, [i.status]: i._count }), {}),
    };
  }

  async importDocumentation(userId: string) {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');

    const DOCS = [
      {
        slug: 'comprehensive-documentation',
        title: '📚 دفتر التوثيق الشامل لنظام SEMOP',
        filename: 'docs/COMPREHENSIVE_DOCUMENTATION.md',
        description: 'التوثيق الكامل والشامل - البنية المعمارية، قاعدة البيانات، Smart Notebook، نظام الخرائط، APIs، دليل المطورين، النشر والصيانة',
        category: 'DOCUMENTATION',
        type: 'GUIDE',
        version: '1.0.0',
      },
      {
        slug: 'documentation-summary',
        title: '📋 ملخص التوثيق التنفيذي',
        filename: 'docs/DOCUMENTATION_SUMMARY.md',
        description: 'ملخص تنفيذي سريع للتوثيق الشامل',
        category: 'DOCUMENTATION',
        type: 'DOCUMENTATION',
        version: '1.0.0',
      },
      {
        slug: 'maps-system-guide',
        title: '🗺️ دليل نظام الخرائط الشامل',
        filename: 'docs/maps-system-guide.md',
        description: 'دليل مفصل لنظام الخرائط الأوفلاين - البنية، الميزات، التكامل، والاستخدام',
        category: 'MAPS',
        type: 'GUIDE',
        version: '1.6.0',
      },
      {
        slug: 'prisma-migration-report',
        title: '🔧 تقرير Prisma 7 Migration',
        filename: 'PRISMA_7_MIGRATION_REPORT.md',
        description: 'تقرير تقني: حل مشكلة Prisma 7 Driver Adapter في Smart Notebook',
        category: 'TECHNICAL',
        type: 'REPORT',
        version: '1.0.0',
      },
    ];

    const results = [];
    const basePath = process.cwd();

    for (const doc of DOCS) {
      try {
        const filePath = join(basePath, doc.filename);
        const content = readFileSync(filePath, 'utf-8');

        const existing = await this.prisma.documentationPage.findUnique({
          where: { slug: doc.slug },
        });

        if (existing) {
          await this.prisma.documentationPage.update({
            where: { slug: doc.slug },
            data: {
              title: doc.title,
              content,
              summary: doc.description,
              type: doc.type as any,
              category: doc.category,
              version: doc.version,
              isPublished: true,
              status: 'PUBLISHED',
              updatedBy: userId,
            },
          });
          results.push({ slug: doc.slug, action: 'updated', title: doc.title });
        } else {
          await this.prisma.documentationPage.create({
            data: {
              slug: doc.slug,
              title: doc.title,
              content,
              summary: doc.description,
              type: doc.type as any,
              category: doc.category,
              version: doc.version,
              isPublished: true,
              status: 'PUBLISHED',
              createdBy: userId,
              tags: [],
            },
          });
          results.push({ slug: doc.slug, action: 'created', title: doc.title });
        }
      } catch (error) {
        results.push({ slug: doc.slug, action: 'error', error: error.message });
      }
    }

    return { success: true, results };
  }
}
