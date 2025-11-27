import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsArray, IsString, IsDateString } from 'class-validator';

// افتراض أن هذا هو DTO للعنصر الواحد الذي تم العثور عليه في البحث
// يجب أن يكون هذا DTO موجودًا في ملف آخر، لكن لغرض هذا المثال سنقوم بتعريفه هنا
class SearchResultItemDto {
  @ApiProperty({ description: 'معرف العنصر', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'عنوان العنصر', example: 'ملاحظة عن الاجتماع' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'مقتطف من محتوى العنصر', example: 'تمت مناقشة الميزانية الجديدة...' })
  @IsString()
  snippet: string;

  @ApiProperty({ description: 'نوع العنصر (مثل: ملاحظة، مهمة، ملف)', example: 'Note' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'تاريخ إنشاء العنصر', example: '2025-11-27T10:00:00.000Z' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'تاريخ آخر تحديث للعنصر', example: '2025-11-27T11:30:00.000Z' })
  @IsDateString()
  updatedAt: Date;
}

export class SearchResponseDto {
  @ApiProperty({ description: 'قائمة بالعناصر التي تطابق البحث', type: [SearchResultItemDto] })
  @IsArray()
  items: SearchResultItemDto[];

  @ApiProperty({ description: 'العدد الإجمالي للعناصر التي تطابق البحث', example: 150 })
  @IsNumber()
  total: number;

  @ApiProperty({ description: 'عدد العناصر في الصفحة الحالية', example: 10 })
  @IsNumber()
  count: number;

  @ApiProperty({ description: 'رقم الصفحة الحالية', example: 1 })
  @IsNumber()
  page: number;

  @ApiProperty({ description: 'عدد الصفحات الإجمالي', example: 15 })
  @IsNumber()
  pages: number;

  @ApiProperty({ description: 'هل هناك صفحة تالية؟', example: true })
  @IsBoolean()
  hasNext: boolean;

  @ApiProperty({ description: 'هل هناك صفحة سابقة؟', example: false })
  @IsBoolean()
  hasPrev: boolean;
}
