/**
 * DTO لاستجابة أمر البيع
 */
export class SalesOrderResponseDto {
  id: string;
  orderNumber: string;
  orderDate: Date;
  customerId: string;
  customerName: string;
  expectedDeliveryDate?: Date;
  paymentTerms?: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
  lines: SalesOrderLineResponseDto[];
}

export class SalesOrderLineResponseDto {
  id: string;
  lineNumber: number;
  itemId: string;
  itemName: string;
  itemCode: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
  lineTotal: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  availableStock?: number;
  invoicedQuantity?: number;
}

export class SalesOrderStatisticsDto {
  totalOrders: number;
  draftOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  invoicedOrders: number;
  totalSalesAmount: number;
  averageOrderValue: number;
}
