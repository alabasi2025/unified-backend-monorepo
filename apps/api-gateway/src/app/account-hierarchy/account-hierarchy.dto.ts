import { IsString, IsOptional, IsBoolean, IsInt, MinLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountHierarchyDto {
  @ApiProperty({ description: 'اسم الهيكلية', minLength: 3 })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'وصف الهيكلية', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'معرف الهيكلية الأب (UUID)', required: false })
  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @ApiProperty({ description: 'مستوى الهيكلية (رقم صحيح)', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  level?: number;

  @ApiProperty({ description: 'حالة التفعيل', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

// Update DTO يجعل جميع الحقول اختيارية
export class UpdateAccountHierarchyDto {
  @ApiProperty({ description: 'اسم الهيكلية', minLength: 3, required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty({ description: 'وصف الهيكلية', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'معرف الهيكلية الأب (UUID)', required: false })
  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @ApiProperty({ description: 'مستوى الهيكلية (رقم صحيح)', required: false })
  @IsOptional()
  @IsInt()
  level?: number;

  @ApiProperty({ description: 'حالة التفعيل', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
