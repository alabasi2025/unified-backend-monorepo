// /home/ubuntu/search-module/dto-response.ts
// Response DTO لنتائج البحث المتقدم

import { ApiProperty } from '@nestjs/swagger';

// تعريف واجهة لنتيجة بحث فردية
export class SearchResultItem {
  @ApiProperty({ description: 'معرف الكيان (ملاحظة، دفتر، وسم، إلخ)', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ description: 'نوع الكيان (notebook, note, tag)', example: 'note' })
  type: string;

  @ApiProperty({ description: 'عنوان أو اسم الكيان', example: 'ملاحظة حول اجتماع الفريق' })
  title: string;

  @ApiProperty({ description: 'مقتطف من المحتوى يظهر فيه نص البحث', example: '...تم مناقشة **ملاحظات الاجتماع** والخطوات التالية...' })
  snippet: string;

  @ApiProperty({ description: 'تاريخ آخر تحديث للكيان', example: '2025-11-25T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'رابط للوصول إلى الكيان', example: '/notes/a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  link: string;
}

// Response DTO الرئيسي لعملية البحث
export class SearchResponseDto {
  @ApiProperty({ description: 'عدد النتائج الإجمالي التي تطابق معايير البحث', example: 42 })
  totalResults: number;

  @ApiProperty({ description: 'عدد النتائج في الصفحة الحالية', example: 10 })
  currentCount: number;

  @ApiProperty({ description: 'رقم الصفحة الحالية', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'عدد الصفحات الإجمالي', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'قائمة بنتائج البحث', type: [SearchResultItem] })
  results: SearchResultItem[];
}
