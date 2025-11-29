import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillingDTO } from './dto/create-billing.dto';
import { UpdateBillingDTO } from './dto/update-billing.dto';
import { BillingQueryDTO } from './dto/billing-query.dto';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateBillingDTO) {
    return await this.prisma.billing.create({
      data: {
        ...createDto,
        periodStart: new Date(createDto.periodStart),
        periodEnd: new Date(createDto.periodEnd),
        dueDate: new Date(createDto.dueDate),
      },
      include: { customer: { select: { id: true, name: true } } },
    });
  }

  async findAll(query: BillingQueryDTO) {
    const { page, limit, sortBy, sortOrder, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.billingType) where.billingType = filters.billingType;
    if (filters.status) where.status = filters.status;
    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.unitId) where.unitId = filters.unitId;

    const [data, total] = await Promise.all([
      this.prisma.billing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { customer: { select: { id: true, name: true } } },
      }),
      this.prisma.billing.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const billing = await this.prisma.billing.findUnique({
      where: { id },
      include: { customer: { select: { id: true, name: true } } },
    });
    if (!billing) throw new NotFoundException(`Billing #${id} not found`);
    return billing;
  }

  async update(id: number, updateDto: UpdateBillingDTO) {
    await this.findOne(id);
    return await this.prisma.billing.update({
      where: { id },
      data: updateDto,
      include: { customer: { select: { id: true, name: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.billing.delete({ where: { id } });
  }
}