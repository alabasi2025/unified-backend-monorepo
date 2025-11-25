// /home/ubuntu/archive-module/dto-update.ts

import { PartialType } from '@nestjs/swagger';
import { CreateArchiveDto } from './create-archive.dto';

/**
 * @description DTO لتحديث سجل أرشفة موجود.
 * يستخدم في طلبات PATCH.
 * يرث من CreateArchiveDto ويجعل جميع الحقول اختيارية باستخدام PartialType.
 */
export class UpdateArchiveDto extends PartialType(CreateArchiveDto) {}
