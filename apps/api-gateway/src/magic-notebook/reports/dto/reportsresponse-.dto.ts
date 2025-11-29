import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsBoolean } from 'class-validator';

export class ReportsResponseDto {
  @ApiProperty({ description: 'معرف التقرير الفريد' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'عنوان التقرير' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'محتوى التقرير أو ملخصه' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'نوع التقرير (مثل: يومي، شهري، سنوي)' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ التقرير' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'حالة التقرير (مثل: مكتمل، قيد المراجعة)' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'هل التقرير مؤرشف' })
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({ description: 'تاريخ إنشاء التقرير' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث للتقرير' })
  @IsDate()
  updatedAt: Date;
}
