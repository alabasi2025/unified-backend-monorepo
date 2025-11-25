import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

// تعريف أنواع التصدير المتاحة
export enum ExportType {
  PDF = 'PDF',
  WORD = 'WORD',
  JSON = 'JSON',
  MARKDOWN = 'MARKDOWN',
}

/**
 * فئة DTO لإنشاء مهمة تصدير جديدة.
 * تتطلب تحديد نوع التصدير، ومعرف الدفتر أو الملاحظة.
 */
export class CreateExportJobDto {
  @ApiProperty({
    description: 'معرف الدفتر المراد تصديره. مطلوب إذا لم يتم تحديد noteId.',
    required: false,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf(o => !o.noteId) // مطلوب إذا لم يتم تحديد noteId
  notebookId?: string;

  @ApiProperty({
    description: 'معرف الملاحظة المراد تصديرها. مطلوب إذا لم يتم تحديد notebookId.',
    required: false,
    example: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210',
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf(o => !o.notebookId) // مطلوب إذا لم يتم تحديد notebookId
  noteId?: string;

  @ApiProperty({
    description: 'نوع التصدير المطلوب (PDF, WORD, JSON, MARKDOWN).',
    enum: ExportType,
    example: ExportType.PDF,
  })
  @IsEnum(ExportType)
  exportType: ExportType;
}
