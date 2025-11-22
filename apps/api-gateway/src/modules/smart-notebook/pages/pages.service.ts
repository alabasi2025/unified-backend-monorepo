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
}
