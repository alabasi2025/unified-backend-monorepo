import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@semop/prisma';
import { AttendanceRecord, Prisma, AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AttendanceRecordCreateInput): Promise<AttendanceRecord> {
    return this.prisma.attendanceRecord.create({ data, include: { employee: true } });
  }

  async findAll(params?: {
    skip?: number; take?: number; where?: Prisma.AttendanceRecordWhereInput; orderBy?: Prisma.AttendanceRecordOrderByWithRelationInput;
  }): Promise<{ data: AttendanceRecord[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.attendanceRecord.findMany({ skip, take, where, orderBy, include: { employee: true } }),
      this.prisma.attendanceRecord.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<AttendanceRecord> {
    const record = await this.prisma.attendanceRecord.findUnique({ where: { id }, include: { employee: true } });
    if (!record) throw new NotFoundException(`Attendance record with ID ${id} not found`);
    return record;
  }

  async findByEmployee(employeeId: string, startDate: Date, endDate: Date): Promise<AttendanceRecord[]> {
    return this.prisma.attendanceRecord.findMany({
      where: {
        employeeId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findByDate(date: Date): Promise<AttendanceRecord[]> {
    return this.prisma.attendanceRecord.findMany({
      where: { date },
      include: { employee: { include: { department: true } } },
      orderBy: { checkIn: 'asc' },
    });
  }

  async update(id: string, data: Prisma.AttendanceRecordUpdateInput): Promise<AttendanceRecord> {
    await this.findOne(id);
    return this.prisma.attendanceRecord.update({ where: { id }, data });
  }

  async remove(id: string): Promise<AttendanceRecord> {
    await this.findOne(id);
    return this.prisma.attendanceRecord.delete({ where: { id } });
  }

  async checkIn(employeeId: string, checkInTime: Date): Promise<AttendanceRecord> {
    const today = new Date(checkInTime);
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.attendanceRecord.findFirst({
      where: { employeeId, date: today },
    });

    if (existing) {
      throw new BadRequestException('Employee already checked in today');
    }

    return this.prisma.attendanceRecord.create({
      data: {
        employee: { connect: { id: employeeId } },
        date: today,
        checkIn: checkInTime,
        status: AttendanceStatus.PRESENT,
      },
      include: { employee: true },
    });
  }

  async checkOut(employeeId: string, checkOutTime: Date): Promise<AttendanceRecord> {
    const today = new Date(checkOutTime);
    today.setHours(0, 0, 0, 0);

    const record = await this.prisma.attendanceRecord.findFirst({
      where: { employeeId, date: today },
    });

    if (!record) {
      throw new NotFoundException('No check-in record found for today');
    }

    if (record.checkOut) {
      throw new BadRequestException('Employee already checked out');
    }

    const workMinutes = Math.floor((checkOutTime.getTime() - record.checkIn.getTime()) / 60000);

    return this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOut: checkOutTime,
        workMinutes,
      },
    });
  }

  async markAbsent(employeeId: string, date: Date): Promise<AttendanceRecord> {
    return this.prisma.attendanceRecord.create({
      data: {
        employee: { connect: { id: employeeId } },
        date,
        status: AttendanceStatus.ABSENT,
      },
    });
  }

  async markLeave(employeeId: string, date: Date): Promise<AttendanceRecord> {
    return this.prisma.attendanceRecord.create({
      data: {
        employee: { connect: { id: employeeId } },
        date,
        status: AttendanceStatus.LEAVE,
      },
    });
  }

  async getMonthlyReport(employeeId: string, year: number, month: number): Promise<AttendanceRecord[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.prisma.attendanceRecord.findMany({
      where: {
        employeeId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    });
  }

  async count(where?: Prisma.AttendanceRecordWhereInput): Promise<number> {
    return this.prisma.attendanceRecord.count({ where });
  }
}
