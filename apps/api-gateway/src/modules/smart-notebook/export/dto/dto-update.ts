import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

// تعريف حالات مهمة التصدير المتاحة
export enum JobStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * فئة DTO لتحديث مهمة تصدير موجودة.
 * تستخدم لتحديث حالة المهمة أو مسار الملف المُصدَّر.
 */
export class UpdateExportJobDto {
  @ApiProperty({
    description: 'الحالة الجديدة لمهمة التصدير.',
    enum: JobStatus,
    required: false,
    example: JobStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @ApiProperty({
    description: 'المسار إلى الملف المُصدَّر (يُملأ عند اكتمال المهمة).',
    required: false,
    example: '/exports/user_id/notebook_id_timestamp.pdf',
  })
  @IsOptional()
  @IsString()
  filePath?: string;
}
