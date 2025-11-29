import { PartialType } from '@nestjs/swagger';
import { CreateAssetDTO } from './create-asset.dto';

export class UpdateAssetDTO extends PartialType(CreateAssetDTO) {}