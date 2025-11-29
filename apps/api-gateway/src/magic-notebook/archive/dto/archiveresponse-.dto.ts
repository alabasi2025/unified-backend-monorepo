import { ApiProperty } from '@nestjs/swagger';

export class ArchiveResponseDto {
  @ApiProperty({ description: 'معرف الأرشيف الفريد' })
  id: string;

  @ApiProperty({ description: 'معرف المستخدم الذي قام بالأرشفة' })
  userId: string;

  @ApiProperty({ description: 'معرف العنصر الذي تم أرشفته (مذكرة، دفتر، إلخ)' })
  itemId: string;

  @ApiProperty({ description: 'نوع العنصر الذي تم أرشفته (مثل: Note, Notebook)' })
  itemType: string;

  @ApiProperty({ description: 'حالة الأرشفة (صحيح إذا كان مؤرشفًا)' })
  isArchived: boolean;

  @ApiProperty({ description: 'تاريخ ووقت إنشاء سجل الأرشفة' })
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ ووقت آخر تحديث لسجل الأرشفة' })
  updatedAt: Date;
}