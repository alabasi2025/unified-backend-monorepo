import { IsNotEmpty, IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/**
 * DTO لإنشاء سجل جين جديد
 */
export class CreateGeneDto {
  @IsNotEmpty({ message: 'يجب توفير رمز الجين.' })
  @IsString({ message: 'يجب أن يكون رمز الجين نصًا.' })
  @MaxLength(50, { message: 'يجب ألا يتجاوز رمز الجين 50 حرفًا.' })
  code: string;

  @IsNotEmpty({ message: 'يجب توفير اسم الجين.' })
  @IsString({ message: 'يجب أن يكون اسم الجين نصًا.' })
  @MaxLength(255, { message: 'يجب ألا يتجاوز اسم الجين 255 حرفًا.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'يجب أن يكون الوصف نصًا.' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'يجب أن تكون حالة التفعيل قيمة منطقية (صحيح/خطأ).' })
  is_active?: boolean;
}

/**
 * DTO لتحديث سجل جين موجود
 * يستخدم PartialType لجعل جميع الحقول اختيارية
 */
export class UpdateGeneDto extends PartialType(CreateGeneDto) {}
