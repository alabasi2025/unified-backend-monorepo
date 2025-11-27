import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// يمكن إضافة Enum لأنواع التقارير إذا كانت محددة
enum ReportType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
  CUSTOM = 'CUSTOM',
}

export class CreateReportDto {
  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ التقرير' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'عنوان التقرير' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'نوع التقرير (مثلاً: يومي، شهري، سنوي)', enum: ReportType })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({ description: 'تاريخ بداية الفترة المشمولة بالتقرير', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'تاريخ نهاية الفترة المشمولة بالتقرير', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'محتوى التقرير أو ملخصه', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'هل التقرير مسودة؟', required: false })
  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}