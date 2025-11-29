import { PartialType } from '@nestjs/swagger';
import { CreateStockCountDTO } from './create-stock-count.dto';

export class UpdateStockCountDTO extends PartialType(CreateStockCountDTO) {}