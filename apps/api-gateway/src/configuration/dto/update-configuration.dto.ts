import { PartialType } from '@nestjs/swagger';
import { CreateConfigurationDTO } from './create-configuration.dto';

/**
 * DTO for updating configuration
 * All fields are optional for partial updates
 */
export class UpdateConfigurationDTO extends PartialType(CreateConfigurationDTO) {}
