
/**
 * @service SalesOrdersService (API Gateway)
 * @description
 * ## خدمة أوامر البيع (API Gateway Service)
 * هذه الخدمة تعمل كطبقة وسيطة بين `SalesOrdersController` والخدمات الأساسية الموجودة في `libs`.
 * وظيفتها هي:
 * - استقبال الطلبات من المتحكم.
 * - استدعاء الوظائف المناسبة من `SalesOrderService` في `@semop/sales`.
 * - معالجة البيانات وتحويلها إذا لزم الأمر قبل إرسالها كاستجابة.
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SalesOrderService as CoreSalesOrderService } from '@semop/sales'; // استيراد الخدمة الأساسية
import { PrismaService } from '@semop/prisma'; // استيراد Prisma للوصول المباشر إذا لزم الأمر
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto';
import { SalesOrderStatus } from '@prisma/client';

@Injectable()
export class SalesOrdersService {
  constructor(
    private readonly coreSalesOrderService: CoreSalesOrderService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * @function findAll
   * @description جلب قائمة أوامر البيع مع الفلترة.
   */
  async findAll(holdingId: string, filters: any) {
    const where: any = {
      holdingId,
      isDeleted: false // استبعاد المحذوفين
    };

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.startDate && filters.endDate) {
      where.orderDate = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    return this.coreSalesOrderService.findAll({
      where,
      skip: filters.skip ? parseInt(filters.skip) : undefined,
      take: filters.take ? parseInt(filters.take) : undefined,
      orderBy: { orderDate: 'desc' },
    });
  }

  /**
   * @function findOne
   * @description جلب تفاصيل أمر بيع واحد.
   */
  async findOne(id: string) {
    const order = await this.coreSalesOrderService.findOne(id);
    if (!order || order.isDeleted) {
      throw new NotFoundException(`لم يتم العثور على أمر البيع بالمعرف ${id}`);
    }
    return order;
  }

  /**
   * @function create
   * @description إنشاء أمر بيع جديد.
   */
  async create(dto: CreateSalesOrderDto, userId: string) {
    // TODO: التحقق من المخزون قبل الإنشاء
    for (const line of dto.lines) {
        const item = await this.prisma.item.findUnique({ where: { id: line.itemId } });
        if (!item) throw new NotFoundException(`الصنف ${line.itemId} غير موجود`);
        // const availableStock = item.quantity - item.reservedQuantity;
        // if (availableStock < line.quantity) {
        //     throw new BadRequestException(`الكمية المطلوبة للصنف ${item.code} غير متوفرة`);
        // }
    }

    return this.coreSalesOrderService.create(dto, userId);
  }

  /**
   * @function update
   * @description تحديث أمر بيع.
   */
  async update(id: string, dto: UpdateSalesOrderDto, userId: string) {
    const existingOrder = await this.findOne(id);
    if (existingOrder.status !== SalesOrderStatus.DRAFT && existingOrder.status !== SalesOrderStatus.PENDING) {
        throw new BadRequestException('لا يمكن تحديث أمر بيع معتمد أو ملغي');
    }
    return this.coreSalesOrderService.update(id, dto, userId);
  }

  /**
   * @function remove
   * @description حذف أمر بيع (حذف ناعم).
   */
  async remove(id: string) {
    const existingOrder = await this.findOne(id);
    if (existingOrder.status !== SalesOrderStatus.DRAFT) {
        throw new BadRequestException('لا يمكن حذف إلا أوامر البيع التي في حالة مسودة');
    }
    return this.coreSalesOrderService.update(id, { isDeleted: true });
  }

  /**
   * @function approve
   * @description اعتماد أمر بيع.
   */
  async approve(id: string, userId: string) {
    return this.coreSalesOrderService.changeStatus(id, SalesOrderStatus.APPROVED, userId);
  }

  /**
   * @function cancel
   * @description إلغاء أمر بيع.
   */
  async cancel(id: string, reason: string, userId: string) {
    const existingOrder = await this.findOne(id);
    if (existingOrder.status === SalesOrderStatus.INVOICED) {
        throw new BadRequestException('لا يمكن إلغاء أمر بيع تم فوترته');
    }
    // TODO: إضافة سبب الإلغاء في الملاحظات أو في حقل مخصص
    return this.coreSalesOrderService.changeStatus(id, SalesOrderStatus.CANCELLED, userId);
  }

  /**
   * @function getStatistics
   * @description جلب إحصائيات أوامر البيع.
   */
  async getStatistics(holdingId: string) {
    const stats = await this.prisma.salesOrder.aggregate({
      where: { holdingId, isDeleted: false },
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    const statusCounts = await this.prisma.salesOrder.groupBy({
      by: ['status'],
      where: { holdingId, isDeleted: false },
      _count: {
        status: true,
      },
    });

    const approvedOrders = statusCounts.find(s => s.status === 'APPROVED')?._count.status || 0;
    const invoicedOrders = statusCounts.find(s => s.status === 'INVOICED')?._count.status || 0;

    return {
      totalOrders: stats._count.id,
      totalSalesAmount: stats._sum.totalAmount || 0,
      approvedOrders,
      invoicedOrders,
    };
  }
}
