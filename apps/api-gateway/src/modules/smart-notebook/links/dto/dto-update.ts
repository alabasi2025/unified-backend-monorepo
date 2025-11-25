// dto-update.ts
import { PartialType } from '@nestjs/swagger';
import { CreateAutoLinkDto } from './dto-create';

/**
 * @class UpdateAutoLinkDto
 * @description يمثل البيانات المطلوبة لتحديث رابط تلقائي موجود.
 * يستخدم PartialType لجعل جميع الحقول اختيارية.
 */
export class UpdateAutoLinkDto extends PartialType(CreateAutoLinkDto) {
  // لا توجد حقول إضافية مطلوبة، جميع الحقول موروثة من CreateAutoLinkDto وجعلت اختيارية.
}
