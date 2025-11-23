import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto, ConversationStatus } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        ...createConversationDto,
        status: 'ACTIVE',
      },
    });
  }

  async findAll(filters?: {
    status?: ConversationStatus;
    category?: string;
    sourceRepo?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.sourceRepo) {
      where.sourceRepo = filters.sourceRepo;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { summary: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.conversation.findMany({
      where,
      include: {
        ideas: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        ideas: {
          include: {
            tasks: {
              select: {
                id: true,
                title: true,
                status: true,
                progress: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async update(id: string, updateConversationDto: UpdateConversationDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.conversation.update({
      where: { id },
      data: {
        ...updateConversationDto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.conversation.delete({
      where: { id },
    });
  }

  async archive(id: string, updatedBy: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.conversation.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        archivedAt: new Date(),
        updatedBy,
      },
    });
  }

  async complete(id: string, updatedBy: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.conversation.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        updatedBy,
      },
    });
  }

  async getStatistics() {
    const [total, active, completed, archived, extracting] = await Promise.all([
      this.prisma.conversation.count(),
      this.prisma.conversation.count({ where: { status: 'ACTIVE' } }),
      this.prisma.conversation.count({ where: { status: 'COMPLETED' } }),
      this.prisma.conversation.count({ where: { status: 'ARCHIVED' } }),
      this.prisma.conversation.count({ where: { status: 'EXTRACTING' } }),
    ]);

    return {
      total,
      active,
      completed,
      archived,
      extracting,
    };
  }

  async importFromFile(fileData: {
    title: string;
    content: string;
    sourceFile: string;
    sourcePath: string;
    sourceRepo: string;
    category: string;
    createdBy: string;
  }) {
    // Calculate metadata
    const lines = fileData.content.split('\n');
    const words = fileData.content.split(/\s+/).filter(Boolean);
    const fileSize = Buffer.byteLength(fileData.content, 'utf8');

    return this.create({
      title: fileData.title,
      content: fileData.content,
      source: 'FILE_IMPORT',
      sourceFile: fileData.sourceFile,
      sourcePath: fileData.sourcePath,
      sourceRepo: fileData.sourceRepo,
      category: fileData.category as any,
      fileSize,
      linesCount: lines.length,
      wordsCount: words.length,
      createdBy: fileData.createdBy,
    });
  }
}
