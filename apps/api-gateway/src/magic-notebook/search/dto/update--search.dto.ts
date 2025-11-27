import { PartialType } from '@nestjs/swagger';
import { CreateSearchDto } from './CreateSearchDto';

export class UpdateSearchDto extends PartialType(CreateSearchDto) {}
