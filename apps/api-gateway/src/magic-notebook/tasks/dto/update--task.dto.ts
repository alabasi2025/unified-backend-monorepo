import { IsString, IsOptional, IsBoolean, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// Base DTO for creating a task
export class CreateTaskDto {
  @ApiProperty({ description: 'عنوان المهمة', example: 'شراء الحليب والخبز' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, description: 'وصف تفصيلي للمهمة' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'حالة اكتمال المهمة', default: false })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiProperty({ required: false, description: 'تاريخ استحقاق المهمة', example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false, description: 'أولوية المهمة (1-5)', minimum: 1, maximum: 5, default: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priority?: number;
}

// Update DTO using PartialType to make all fields optional
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
