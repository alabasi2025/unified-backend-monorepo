import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new reminder record in the database.
   */
  async create(createReminderDto: CreateReminderDto) {
    return this.prisma.reminder.create({
      data: {
        ...createReminderDto,
        reminderDate: new Date(createReminderDto.reminderDate),
      },
    });
  }

  /**
   * Retrieves all reminders.
   */
  async findAll() {
    return this.prisma.reminder.findMany({
      include: {
        page: true,
      },
      orderBy: { reminderDate: 'asc' },
    });
  }

  /**
   * Retrieves reminders by page ID.
   */
  async findByPageId(pageId: string) {
    return this.prisma.reminder.findMany({
      where: { pageId },
      orderBy: { reminderDate: 'asc' },
    });
  }

  /**
   * Retrieves upcoming reminders (not completed and future dates).
   */
  async findUpcoming() {
    return this.prisma.reminder.findMany({
      where: {
        isCompleted: false,
        reminderDate: {
          gte: new Date(),
        },
      },
      include: {
        page: true,
      },
      orderBy: { reminderDate: 'asc' },
    });
  }

  /**
   * Retrieves a single reminder by its ID.
   */
  async findOne(id: string) {
    const reminder = await this.prisma.reminder.findUnique({
      where: { id },
      include: {
        page: true,
      },
    });

    if (!reminder) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }

    return reminder;
  }

  /**
   * Updates an existing reminder record by its ID.
   */
  async update(id: string, updateReminderDto: UpdateReminderDto) {
    await this.findOne(id);

    const data: any = { ...updateReminderDto };
    if (updateReminderDto.reminderDate) {
      data.reminderDate = new Date(updateReminderDto.reminderDate);
    }

    return this.prisma.reminder.update({
      where: { id },
      data,
    });
  }

  /**
   * Marks a reminder as completed.
   */
  async markAsCompleted(id: string) {
    await this.findOne(id);

    return this.prisma.reminder.update({
      where: { id },
      data: { isCompleted: true },
    });
  }

  /**
   * Removes a reminder record by its ID.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.reminder.delete({
      where: { id },
    });
  }
}
