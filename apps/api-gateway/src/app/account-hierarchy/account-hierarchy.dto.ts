import { IsUUID, IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, MaxLength } from 'class-validator';

// DTO لإنشاء حساب جديد في الهيكلية
export class CreateAccountHierarchyDto {
  @IsUUID('4', { message: 'institutionId يجب أن يكون UUID صالحاً.' })
  @IsNotEmpty({ message: 'institutionId مطلوب.' })
  institutionId: string;

  @IsOptional()
  @IsUUID('4', { message: 'parentId يجب أن يكون UUID صالحاً.' })
  parentId?: string;

  @IsUUID('4', { message: 'accountTypeId يجب أن يكون UUID صالحاً.' })
  @IsNotEmpty({ message: 'accountTypeId مطلوب.' })
  accountTypeId: string;

  @IsString({ message: 'code يجب أن يكون نصاً.' })
  @IsNotEmpty({ message: 'code مطلوب.' })
  @MaxLength(50, { message: 'code يجب ألا يتجاوز 50 حرفاً.' })
  code: string;

  @IsString({ message: 'name يجب أن يكون نصاً.' })
  @IsNotEmpty({ message: 'name مطلوب.' })
  @MaxLength(255, { message: 'name يجب ألا يتجاوز 255 حرفاً.' })
  name: string;

  @IsInt({ message: 'level يجب أن يكون عدداً صحيحاً.' })
  @Min(1, { message: 'level يجب أن يكون أكبر من أو يساوي 1.' })
  @IsNotEmpty({ message: 'level مطلوب.' })
  level: number;

  @IsOptional()
  @IsBoolean({ message: 'isGroup يجب أن يكون قيمة منطقية.' })
  isGroup?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isActive يجب أن يكون قيمة منطقية.' })
  isActive?: boolean;
}

// DTO لتحديث حساب موجود في الهيكلية
export class UpdateAccountHierarchyDto {
  @IsOptional()
  @IsUUID('4', { message: 'institutionId يجب أن يكون UUID صالحاً.' })
  institutionId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'parentId يجب أن يكون UUID صالحاً.' })
  parentId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'accountTypeId يجب أن يكون UUID صالحاً.' })
  accountTypeId?: string;

  @IsOptional()
  @IsString({ message: 'code يجب أن يكون نصاً.' })
  @MaxLength(50, { message: 'code يجب ألا يتجاوز 50 حرفاً.' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'name يجب أن يكون نصاً.' })
  @MaxLength(255, { message: 'name يجب ألا يتجاوز 255 حرفاً.' })
  name?: string;

  @IsOptional()
  @IsInt({ message: 'level يجب أن يكون عدداً صحيحاً.' })
  @Min(1, { message: 'level يجب أن يكون أكبر من أو يساوي 1.' })
  level?: number;

  @IsOptional()
  @IsBoolean({ message: 'isGroup يجب أن يكون قيمة منطقية.' })
  isGroup?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isActive يجب أن يكون قيمة منطقية.' })
  isActive?: boolean;
}
