// dto-update.ts
import { PartialType } from '@nestjs/swagger';
import { CreateNotebookDto } from './dto-create';

/**
 * @class UpdateNotebookDto
 * @description يمثل البيانات الاختيارية لتحديث دفتر ملاحظات موجود.
 * يرث من CreateNotebookDto ويجعل جميع الحقول اختيارية باستخدام PartialType.
 */
export class UpdateNotebookDto extends PartialType(CreateNotebookDto) {}
