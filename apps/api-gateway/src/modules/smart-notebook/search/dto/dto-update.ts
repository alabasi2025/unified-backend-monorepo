// /home/ubuntu/search-module/dto-update.ts
// Update DTO لعملية البحث.
// بما أن عملية البحث هي عملية فورية ولا يتم تحديثها، فإن هذا الـ DTO سيكون فارغًا أو يستخدم لأغراض مستقبلية.

import { PartialType } from '@nestjs/swagger';
import { CreateSearchDto } from './dto-create';

// نستخدم PartialType لجعل جميع حقول CreateSearchDto اختيارية
export class UpdateSearchDto extends PartialType(CreateSearchDto) {
  // يمكن إضافة حقول خاصة بالتحديث هنا إذا لزم الأمر
}
