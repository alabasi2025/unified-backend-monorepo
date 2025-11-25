import { CreateSalesOrderLineDto } from './create-sales-order.dto';

/**
 * DTO لتحديث أمر بيع
 */
export class UpdateSalesOrderDto {
  orderNumber?: string;
  orderDate?: Date;
  customerId?: string;
  expectedDeliveryDate?: Date;
  paymentTerms?: string;
  notes?: string;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'PARTIALLY_INVOICED' | 'INVOICED';
  lines?: CreateSalesOrderLineDto[];
}
