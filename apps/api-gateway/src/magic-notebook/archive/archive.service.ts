import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@Injectable()
export class ArchiveService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new archive record.
   * @param createArchiveDto The data transfer object for creating an archive.
   * @returns The created archive record.
   */
  async create(createArchiveDto: CreateArchiveDto) {
    return this.prisma.archive.create({
      data: createArchiveDto,
    });
  }

  /**
   * Retrieves all archive records.
   * @returns A list of all archive records.
   */
  async findAll() {
    return this.prisma.archive.findMany();
  }

  /**
   * Retrieves a single archive record by its ID.
   * Throws NotFoundException if the record does not exist.
   * @param id The unique identifier of the archive record.
   * @returns The found archive record.
   */
  async findOne(id: string) {
    const archive = await this.prisma.archive.findUnique({
      where: { id },
    });

    if (!archive) {
      throw new NotFoundException(\`Archive with ID \${id} not found\`);
    }

    return archive;
  }

  /**
   * Updates an existing archive record by its ID.
   * Checks for existence before updating.
   * @param id The unique identifier of the archive record to update.
   * @param updateArchiveDto The data transfer object for updating the archive.
   * @returns The updated archive record.
   */
  async update(id: string, updateArchiveDto: UpdateArchiveDto) {
    // Check if the record exists to ensure proper error handling
    await this.findOne(id); 

    return this.prisma.archive.update({
      where: { id },
      data: updateArchiveDto,
    });
  }

  /**
   * Deletes an archive record by its ID.
   * Checks for existence before deleting.
   * @param id The unique identifier of the archive record to delete.
   * @returns The deleted archive record.
   */
  async remove(id: string) {
    // Check if the record exists to ensure proper error handling
    await this.findOne(id); 

    return this.prisma.archive.delete({
      where: { id },
    });
  }
}
