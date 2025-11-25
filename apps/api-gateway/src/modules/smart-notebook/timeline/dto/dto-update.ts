// /home/ubuntu/timeline-module/dto-update.ts
// Update DTO لتحديث حدث في التتبع الزمني (عادةً لا يتم تحديث أحداث التتبع الزمني، لكن يتم توفيره لنمط RESTful كامل)

import { PartialType } from '@nestjs/mapped-types';
import { CreateTimelineEventDto } from './dto-create';

// نستخدم PartialType لجعل جميع حقول CreateTimelineEventDto اختيارية
export class UpdateTimelineEventDto extends PartialType(CreateTimelineEventDto) {
  // يمكن إضافة حقول خاصة بالتحديث هنا إذا لزم الأمر
}
