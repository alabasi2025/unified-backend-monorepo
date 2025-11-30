import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO لربط الجين بالقطاع
 * يستخدم لتحديث القطاع المرتبط بجين معين
 */
export class LinkGeneSectorDto {
  @ApiProperty({
    description: 'معرف الجين الفريد',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  geneId: string;

  @ApiProperty({
    description: 'رمز القطاع (GENERAL, SUPERMARKET, PHARMACY, RESTAURANT, HOSPITAL)',
    example: 'SUPERMARKET',
  })
  @IsString()
  @IsNotEmpty()
  sectorCode: string;
}
