// update-recent-activity.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateRecentActivityDto } from './create-recent-activity.dto';

/**
 * @description: فئة DTO لتحديث سجل نشاط موجود.
 * تستخدم PartialType لجعل جميع الحقول اختيارية، مما يسمح بتحديث جزئي.
 */
export class UpdateRecentActivityDto extends PartialType(CreateRecentActivityDto) {
  // لا حاجة لإضافة حقول هنا، فـ PartialType يجعل جميع حقول CreateRecentActivityDto اختيارية.
}
