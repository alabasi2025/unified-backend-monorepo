// dto-response.ts
import { ApiProperty } from '@nestjs/swagger';
import { AutoLink } from '@prisma/client'; // نفترض أن Prisma Client تم إنشاؤه

/**
 * @class AutoLinkResponseDto
 * @description يمثل هيكل الاستجابة لرابط تلقائي (AutoLink).
 */
export class AutoLinkResponseDto {
  /**
   * @property id
   * @description المعرف الفريد للرابط.
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({
    description: 'المعرف الفريد للرابط',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  /**
   * @property createdAt
   * @description تاريخ إنشاء الرابط.
   * @example '2023-10-27T10:00:00.000Z'
   */
  @ApiProperty({
    description: 'تاريخ إنشاء الرابط',
    example: '2023-10-27T10:00:00.000Z',
  })
  createdAt: Date;

  /**
   * @property updatedAt
   * @description تاريخ آخر تحديث للرابط.
   * @example '2023-10-27T10:30:00.000Z'
   */
  @ApiProperty({
    description: 'تاريخ آخر تحديث للرابط',
    example: '2023-10-27T10:30:00.000Z',
  })
  updatedAt: Date;

  /**
   * @property sourceType
   * @description نوع العنصر المصدر.
   * @example 'Note'
   */
  @ApiProperty({
    description: 'نوع العنصر المصدر',
    example: 'Note',
  })
  sourceType: string;

  /**
   * @property sourceId
   * @description معرف العنصر المصدر.
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @ApiProperty({
    description: 'معرف العنصر المصدر',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
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
  targetType: string;

  /**
   * @property targetId
   * @description معرف العنصر الهدف.
   * @example 'f0e9d8c7-b6a5-4321-fedc-ba9876543210'
   */
  @ApiProperty({
    description: 'معرف العنصر الهدف',
    example: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210',
  })
  targetId: string;

  /**
   * @property linkType
   * @description نوع العلاقة بين العنصرين.
   * @example 'mentions'
   */
  @ApiProperty({
    description: 'نوع العلاقة بين العنصرين',
    example: 'mentions',
  })
  linkType: string;

  /**
   * @property metadata
   * @description بيانات إضافية حول عملية الربط التلقائي.
   * @example { "confidence": 0.95, "algorithm": "NLP" }
   */
  @ApiProperty({
    description: 'بيانات إضافية حول عملية الربط التلقائي',
    required: false,
    type: () => Object,
    example: { confidence: 0.95, algorithm: 'NLP' },
  })
  metadata: any;

  /**
   * @constructor
   * @description يقوم بإنشاء كائن استجابة من كائن Prisma AutoLink.
   * @param autoLink كائن AutoLink من Prisma.
   */
  constructor(autoLink: AutoLink) {
    this.id = autoLink.id;
    this.createdAt = autoLink.createdAt;
    this.updatedAt = autoLink.updatedAt;
    this.sourceType = autoLink.sourceType;
    this.sourceId = autoLink.sourceId;
    this.targetType = autoLink.targetType;
    this.targetId = autoLink.targetId;
    this.linkType = autoLink.linkType;
    this.metadata = autoLink.metadata;
  }
}
