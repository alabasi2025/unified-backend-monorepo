import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO لإنشاء وحدة جديدة
export class CreateUnitDto {
  @ApiProperty({ description: 'اسم الوحدة', example: 'قطعة' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'رمز الوحدة', example: 'pc' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  symbol: string;

  @ApiProperty({ description: 'وصف إضافي للوحدة', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

// DTO لتحديث وحدة موجودة
export class UpdateUnitDto {
  @ApiProperty({ description: 'اسم الوحدة', example: 'قطعة', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiProperty({ description: 'رمز الوحدة', example: 'pc', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  symbol?: string;

  @ApiProperty({ description: 'حالة التفعيل', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'وصف إضافي للوحدة', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
