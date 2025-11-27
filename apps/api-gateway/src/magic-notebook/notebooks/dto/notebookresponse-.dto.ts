import { ApiProperty } from '@nestjs/swagger';

export class NotebookResponseDto {
  @ApiProperty({ description: 'معرف المفكرة الفريد' })
  id: string;

  @ApiProperty({ description: 'معرف المستخدم الذي أنشأ المفكرة' })
  userId: string;

  @ApiProperty({ description: 'عنوان المفكرة' })
  title: string;

  @ApiProperty({ description: 'وصف المفكرة (اختياري)' })
  description?: string;

  @ApiProperty({ description: 'حالة الأرشفة للمفكرة' })
  isArchived: boolean;

  @ApiProperty({ description: 'تاريخ إنشاء المفكرة' })
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث للمفكرة' })
  updatedAt: Date;
}
