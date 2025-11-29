import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new attachment record in the database.
   */
  async create(createAttachmentDto: CreateAttachmentDto) {
    return this.prisma.attachment.create({
      data: createAttachmentDto,
    });
  }

  /**
   * Retrieves all attachments.
   */
  async findAll() {
    return this.prisma.attachment.findMany({
      include: {
        page: true,
      },
    });
  }

  /**
   * Retrieves attachments by page ID.
   */
  async findByPageId(pageId: string) {
    return this.prisma.attachment.findMany({
      where: { pageId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  /**
   * Retrieves a single attachment by its ID.
   */
  async findOne(id: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
      include: {
        page: true,
      },
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return attachment;
  }

  /**
   * Updates an existing attachment record by its ID.
   */
  async update(id: string, updateAttachmentDto: UpdateAttachmentDto) {
    await this.findOne(id);

    return this.prisma.attachment.update({
      where: { id },
      data: updateAttachmentDto,
    });
  }

  /**
   * Removes an attachment record by its ID.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.attachment.delete({
      where: { id },
    });
  }
}
