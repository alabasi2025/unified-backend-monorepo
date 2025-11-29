/**
 * DTO لإنشاء أمر بيع جديد
 */
export class CreateSalesOrderDto {
  orderNumber?: string;
  orderDate: Date;
  customerId: string;
  expectedDeliveryDate?: Date;
  paymentTerms?: string;
  notes?: string;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'PARTIALLY_INVOICED' | 'INVOICED';
  
  // Multi-Entity Support
  holdingId?: string;
  unitId?: string;
  projectId?: string;
  
  // Lines
  lines: CreateSalesOrderLineDto[];
}

export class CreateSalesOrderLineDto {
  itemId: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  discountRate?: number;
  description?: string;
}
