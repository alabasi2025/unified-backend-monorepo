import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Injectable()
export class NotebooksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new notebook record in the database.
   * @param createNotebookDto The data transfer object for creating a notebook.
   * @returns The created notebook object.
   */
  async create(createNotebookDto: CreateNotebookDto) {
    // Assuming the Prisma model is named 'notebook'
    return this.prisma.notebook.create({
      data: createNotebookDto,
    });
  }

  /**
   * Retrieves all notebook records from the database.
   * @returns A list of all notebooks.
   */
  async findAll() {
    return this.prisma.notebook.findMany();
  }

  /**
   * Retrieves a single notebook by its ID.
   * Throws NotFoundException if the notebook does not exist.
   * @param id The unique identifier of the notebook.
   * @returns The found notebook object.
   */
  async findOne(id: string) {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id },
    });

    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found`);
    }

    return notebook;
  }

  /**
   * Updates an existing notebook record by its ID.
   * Checks for existence first using findOne.
   * @param id The unique identifier of the notebook to update.
   * @param updateNotebookDto The data transfer object for updating the notebook.
   * @returns The updated notebook object.
   */
  async update(id: string, updateNotebookDto: UpdateNotebookDto) {
    // Check if the notebook exists before attempting to update
    await this.findOne(id); 

    return this.prisma.notebook.update({
      where: { id },
      data: updateNotebookDto,
    });
  }

  /**
   * Removes a notebook record by its ID.
   * Checks for existence first using findOne.
   * @param id The unique identifier of the notebook to remove.
   * @returns The deleted notebook object.
   */
  async remove(id: string) {
    // Check if the notebook exists before attempting to delete
    await this.findOne(id); 

    return this.prisma.notebook.delete({
      where: { id },
    });
  }
}