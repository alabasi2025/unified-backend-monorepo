import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from '../purchase-order.entity';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from '../dto/purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  // CREATE
  async create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    // توليد رقم طلب افتراضي إذا لم يتم توفيره
    const orderNumber = createDto.order_number || \`PO-\${Date.now()}\`;

    const newOrder = this.purchaseOrderRepository.create({
      ...createDto,
      order_number: orderNumber,
      status: createDto.status || PurchaseOrderStatus.DRAFT,
      // total_amount سيتم حسابه لاحقاً عند إضافة البنود
      total_amount: 0.0,
    });

    return this.purchaseOrderRepository.save(newOrder);
  }

  // READ ALL
  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.find();
  }

  // READ ONE
  async findOne(id: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(\`Purchase Order with ID "\${id}" not found\`);
    }
    return order;
  }

  // UPDATE
  async update(id: string, updateDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const order = await this.findOne(id);

    // تحديث الحقول المسموح بها
    Object.assign(order, updateDto);

    // تحديث حقل last_modified_by_user_id
    if (updateDto.last_modified_by_user_id) {
      order.last_modified_by_user_id = updateDto.last_modified_by_user_id;
    }

    return this.purchaseOrderRepository.save(order);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const result = await this.purchaseOrderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(\`Purchase Order with ID "\${id}" not found\`);
    }
  }
}
