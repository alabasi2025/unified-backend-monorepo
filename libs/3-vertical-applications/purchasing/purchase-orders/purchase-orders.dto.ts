// /home/ubuntu/purchase_orders/src/dto/create-purchase-order.dto.ts

import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreatePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @IsOptional()
  @IsDateString()
  orderDate?: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
}
