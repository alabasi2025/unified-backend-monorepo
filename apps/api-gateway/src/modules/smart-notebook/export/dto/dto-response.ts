import { ApiProperty } from '@nestjs/swagger';
import { ExportType } from './dto-create';
import { JobStatus } from './dto-update';

/**
 * فئة DTO لتمثيل مهمة تصدير (ExportJob) في الاستجابات.
 */
export class ExportJobResponseDto {
  @ApiProperty({
    description: 'المعرف الفريد لمهمة التصدير.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'معرف المستخدم الذي طلب التصدير.',
    example: 'user-uuid-12345',
  })
  userId: string;

  @ApiProperty({
    description: 'معرف الدفتر المراد تصديره.',
    required: false,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  notebookId?: string;

  @ApiProperty({
    description: 'معرف الملاحظة المراد تصديرها.',
    required: false,
    example: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210',
  })
  noteId?: string;

  @ApiProperty({
    description: 'نوع التصدير المطلوب.',
    enum: ExportType,
    example: ExportType.PDF,
  })
  exportType: ExportType;

  @ApiProperty({
    description: 'حالة المهمة.',
    enum: JobStatus,
    example: JobStatus.PENDING,
  })
  status: JobStatus;

  @ApiProperty({
    description: 'المسار إلى الملف المُصدَّر.',
    required: false,
    example: '/exports/user-uuid-12345/notebook-export-20251125.pdf',
  })
  filePath?: string;

  @ApiProperty({
    description: 'تاريخ ووقت إنشاء المهمة.',
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'تاريخ ووقت آخر تحديث للمهمة.',
    example: new Date().toISOString(),
  })
  updatedAt: Date;
}
