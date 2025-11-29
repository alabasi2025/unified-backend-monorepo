import { IsNotEmpty, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseOrderStatus } from '../purchase-order.entity';

// DTO لإنشاء طلب شراء جديد
export class CreatePurchaseOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  // رقم الطلب: يفضل أن يتم توليده آلياً في نظام ERP، لكن نجعله اختيارياً هنا لمرونة المثال
  order_number?: string;

  @IsNotEmpty()
  @IsDateString()
  order_date: Date; // تاريخ الطلب

  @IsOptional()
  @IsDateString()
  required_date?: Date; // تاريخ الاستلام المطلوب

  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus; // حالة الطلب (افتراضياً Draft)

  @IsNotEmpty()
  @IsUUID()
  vendor_id: string; // معرف المورد

  @IsNotEmpty()
  @IsUUID()
  created_by_user_id: string; // معرف المستخدم الذي أنشأ الطلب

  @IsOptional()
  @IsString()
  notes?: string; // ملاحظات إضافية

  // يمكن إضافة حقل لبنود الطلب هنا (PurchaseOrderItems)
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreatePurchaseOrderItemDto)
  // items: CreatePurchaseOrderItemDto[];
}

// DTO لتحديث طلب شراء موجود
export class UpdatePurchaseOrderDto {
  @IsOptional()
  @IsDateString()
  order_date?: Date;

  @IsOptional()
  @IsDateString()
  required_date?: Date;

  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;

  @IsOptional()
  @IsUUID()
  vendor_id?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  last_modified_by_user_id?: string; // معرف المستخدم الذي قام بالتعديل
}
