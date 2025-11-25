import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO للاستجابة (Response) لتمثيل بيانات القسم (Section)
 * يستخدم لإرجاع بيانات القسم بعد عمليات الإنشاء، التحديث، أو الاستعلام.
 */
export class SectionResponseDto {
  /**
   * المعرف الفريد للقسم.
   */
  @ApiProperty({
    description: 'المعرف الفريد للقسم',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  /**
   * اسم القسم.
   */
  @ApiProperty({
    description: 'اسم القسم',
    example: 'مقدمة المشروع',
  })
  name: string;

  /**
   * ترتيب القسم داخل الدفتر.
   */
  @ApiProperty({
    description: 'ترتيب القسم داخل الدفتر',
    example: 1,
  })
  rank: number;

  /**
   * معرف الدفتر (Notebook ID) الذي ينتمي إليه القسم.
   */
  @ApiProperty({
    description: 'معرف الدفتر (UUID)',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  notebookId: string;

  /**
   * تاريخ ووقت إنشاء القسم.
   */
  @ApiProperty({
    description: 'تاريخ ووقت الإنشاء',
    example: new Date().toISOString(),
  })
  createdAt: Date;

  /**
   * تاريخ ووقت آخر تحديث للقسم.
   */
  @ApiProperty({
    description: 'تاريخ ووقت آخر تحديث',
    example: new Date().toISOString(),
  })
  updatedAt: Date;

  /**
   * دالة مساعدة لتحويل كائن Prisma Section إلى SectionResponseDto.
   * @param section كائن القسم من Prisma.
   * @returns كائن SectionResponseDto.
   */
  static fromPrisma(section: any): SectionResponseDto {
    const dto = new SectionResponseDto();
    dto.id = section.id;
    dto.name = section.name;
    dto.rank = section.rank;
    dto.notebookId = section.notebookId;
    dto.createdAt = section.createdAt;
    dto.updatedAt = section.updatedAt;
    return dto;
  }
}
