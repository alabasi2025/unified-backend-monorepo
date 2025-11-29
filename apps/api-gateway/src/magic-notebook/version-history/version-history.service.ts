import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVersionHistoryDto } from './dto/create-version-history.dto';
import { UpdateVersionHistoryDto } from './dto/update-version-history.dto';

@Injectable()
export class VersionHistoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new version history record in the database.
   */
  async create(createVersionHistoryDto: CreateVersionHistoryDto) {
    return this.prisma.versionHistory.create({
      data: createVersionHistoryDto,
    });
  }

  /**
   * Retrieves all version history records.
   */
  async findAll() {
    return this.prisma.versionHistory.findMany({
      include: {
        page: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves version history by page ID.
   */
  async findByPageId(pageId: string) {
    return this.prisma.versionHistory.findMany({
      where: { pageId },
      orderBy: { versionNumber: 'desc' },
    });
  }

  /**
   * Retrieves the latest version for a specific page.
   */
  async findLatestByPageId(pageId: string) {
    return this.prisma.versionHistory.findFirst({
      where: { pageId },
      orderBy: { versionNumber: 'desc' },
    });
  }

  /**
   * Retrieves a single version history record by its ID.
   */
  async findOne(id: string) {
    const version = await this.prisma.versionHistory.findUnique({
      where: { id },
      include: {
        page: true,
      },
    });

    if (!version) {
      throw new NotFoundException(`Version history with ID ${id} not found`);
    }

    return version;
  }

  /**
   * Updates an existing version history record by its ID.
   */
  async update(id: string, updateVersionHistoryDto: UpdateVersionHistoryDto) {
    await this.findOne(id);

    return this.prisma.versionHistory.update({
      where: { id },
      data: updateVersionHistoryDto,
    });
  }

  /**
   * Removes a version history record by its ID.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.versionHistory.delete({
      where: { id },
    });
  }

  /**
   * Creates a new version automatically when a page is updated.
   */
  async createAutoVersion(pageId: string, content: string, userId?: string) {
    const latestVersion = await this.findLatestByPageId(pageId);
    const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

    return this.create({
      pageId,
      versionNumber: nextVersionNumber,
      content,
      changeDescription: 'Auto-saved version',
      createdBy: userId,
    });
  }
}
