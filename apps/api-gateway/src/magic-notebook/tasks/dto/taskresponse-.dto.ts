import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDate, IsNumber } from 'class-validator';

export class TaskResponseDto {
  @ApiProperty({ description: 'معرف المهمة الفريد' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ المهمة' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'عنوان المهمة' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'وصف المهمة', required: false })
  @IsString()
  description: string | null;

  @ApiProperty({ description: 'حالة اكتمال المهمة' })
  @IsBoolean()
  isCompleted: boolean;

  @ApiProperty({ description: 'تاريخ استحقاق المهمة', required: false })
  @IsDate()
  dueDate: Date | null;

  @ApiProperty({ description: 'تاريخ إنشاء المهمة' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث للمهمة' })
  @IsDate()
  updatedAt: Date;
}
