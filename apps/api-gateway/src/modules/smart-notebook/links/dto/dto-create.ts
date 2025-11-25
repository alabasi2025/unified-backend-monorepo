// dto-create.ts
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @class CreateAutoLinkDto
 * @description يمثل البيانات المطلوبة لإنشاء رابط تلقائي جديد (AutoLink).
 */
export class CreateAutoLinkDto {
  /**
   * @property sourceType
   * @description نوع العنصر المصدر (مثل 'Note', 'Tag', 'Section').
   * @example 'Note'
   */
  @ApiProperty({
    description: 'نوع العنصر المصدر (مثل Note, Tag, Section)',
    example: 'Note',
  })
  @IsString({ message: 'sourceType يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'sourceType مطلوب' })
  sourceType: string;

  /**
   * @property sourceId
   * @description المعرف الفريد للعنصر المصدر.
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({
    description: 'المعرف الفريد للعنصر المصدر',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID('4', { message: 'sourceId يجب أن يكون UUID صالحًا' })
  @IsNotEmpty({ message: 'sourceId مطلوب' })
  sourceId: string;

  /**
   * @property targetType
   * @description نوع العنصر الهدف.
   * @example 'Tag'
   */
  @ApiProperty({
    description: 'نوع العنصر الهدف',
    example: 'Tag',
  })
  @IsString({ message: 'targetType يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'targetType مطلوب' })
  targetType: string;

  /**
   * @property targetId
   * @description المعرف الفريد للعنصر الهدف.
   * @example 'f0e9d8c7-b6a5-4321-fedc-ba9876543210'
   */
  @ApiProperty({
    description: 'المعرف الفريد للعنصر الهدف',
    example: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210',
  })
  @IsUUID('4', { message: 'targetId يجب أن يكون UUID صالحًا' })
  @IsNotEmpty({ message: 'targetId مطلوب' })
  targetId: string;

  /**
   * @property linkType
   * @description نوع العلاقة بين العنصرين (مثل 'mentions', 'related_to', 'contains').
   * @example 'mentions'
   */
  @ApiProperty({
    description: 'نوع العلاقة بين العنصرين',
    example: 'mentions',
  })
  @IsString({ message: 'linkType يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'linkType مطلوب' })
  linkType: string;

  /**
   * @property metadata
   * @description بيانات إضافية حول عملية الربط التلقائي.
   * @example { "confidence": 0.95, "algorithm": "NLP" }
   */
  @ApiProperty({
    description: 'بيانات إضافية حول عملية الربط التلقائي',
    required: false,
    type: 'object',
    example: { confidence: 0.95, algorithm: 'NLP' },
  })
  @IsOptional()
  @IsObject({ message: 'metadata يجب أن يكون كائنًا' })
  metadata?: Record<string, any>;
}
