import { IsString, IsOptional, IsBoolean, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'عنوان المهمة', example: 'شراء حليب وخبز' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'وصف تفصيلي للمهمة', required: false, example: 'التأكد من شراء حليب قليل الدسم وخبز أسمر' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'هل المهمة مكتملة؟', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiProperty({ description: 'تاريخ استحقاق المهمة (ISO 8601)', required: false, example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ description: 'أولوية المهمة (1: منخفضة, 5: عالية)', required: false, minimum: 1, maximum: 5, default: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;
}
