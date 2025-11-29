import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new page record in the database.
   * @param createPageDto The data transfer object for creating a page.
   * @returns The newly created page object.
   */
  async create(createPageDto: CreatePageDto) {
    // Assuming 'page' is the model name in Prisma schema for the pages module
    return this.prisma.page.create({
      data: createPageDto,
    });
  }

  /**
   * Retrieves all page records from the database.
   * @returns A list of all page objects.
   */
  async findAll() {
    return this.prisma.page.findMany();
  }

  /**
   * Retrieves a single page record by its unique ID.
   * Throws NotFoundException if the page does not exist.
   * @param id The unique identifier of the page.
   * @returns The found page object.
   */
  async findOne(id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return page;
  }

  /**
   * Updates an existing page record by its unique ID.
   * Checks for existence before updating.
   * @param id The unique identifier of the page to update.
   * @param updatePageDto The data transfer object for updating a page.
   * @returns The updated page object.
   */
  async update(id: string, updatePageDto: UpdatePageDto) {
    // Check if the page exists to ensure proper error handling
    await this.findOne(id); 
    
    return this.prisma.page.update({
      where: { id },
      data: updatePageDto,
    });
  }

  /**
   * Deletes a page record by its unique ID.
   * Checks for existence before deleting.
   * @param id The unique identifier of the page to delete.
   * @returns The deleted page object.
   */
  async remove(id: string) {
    // Check if the page exists to ensure proper error handling
    await this.findOne(id); 
    
    return this.prisma.page.delete({
      where: { id },
    });
  }
}