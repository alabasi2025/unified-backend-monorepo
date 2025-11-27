import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new task in the database.
   * @param createTaskDto The data transfer object for creating a task.
   * @returns The newly created task object.
   */
  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  /**
   * Retrieves all tasks from the database.
   * @returns A list of all tasks.
   */
  async findAll() {
    return this.prisma.task.findMany();
  }

  /**
   * Retrieves a single task by its ID.
   * @param id The unique identifier of the task.
   * @returns The task object.
   * @throws NotFoundException if the task is not found.
   */
  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(\`Task with ID \${id} not found\`);
    }
    return task;
  }

  /**
   * Updates an existing task by its ID.
   * @param id The unique identifier of the task to update.
   * @param updateTaskDto The data transfer object for updating a task.
   * @returns The updated task object.
   * @throws NotFoundException if the task is not found.
   */
  async update(id: string, updateTaskDto: UpdateTaskDto) {
    // Check if the task exists before attempting to update
    await this.findOne(id); 
    
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  /**
   * Removes a task by its ID.
   * @param id The unique identifier of the task to remove.
   * @returns The removed task object.
   * @throws NotFoundException if the task is not found.
   */
  async remove(id: string) {
    // Check if the task exists before attempting to delete
    await this.findOne(id); 
    
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
