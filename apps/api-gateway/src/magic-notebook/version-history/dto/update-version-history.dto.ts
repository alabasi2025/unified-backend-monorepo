import { PartialType } from '@nestjs/swagger';
import { CreateVersionHistoryDto } from './create-version-history.dto';

export class UpdateVersionHistoryDto extends PartialType(CreateVersionHistoryDto) {}
