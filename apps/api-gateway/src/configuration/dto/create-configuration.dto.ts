import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  IsJSON,
} from 'class-validator';

/**
 * DTO for system configuration
 * Manages system-wide and customer-specific settings
 */
export class CreateConfigurationDTO {
  @ApiProperty({
    description: 'Configuration key (unique identifier)',
    example: 'ENABLE_MAGIC_NOTEBOOK',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Configuration value',
    example: 'true',
  })
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Configuration category',
    enum: ['SYSTEM', 'FEATURE', 'GENE', 'INTEGRATION', 'UI'],
    example: 'FEATURE',
  })
  @IsEnum(['SYSTEM', 'FEATURE', 'GENE', 'INTEGRATION', 'UI'])
  category: string;

  @ApiProperty({
    description: 'Configuration scope',
    enum: ['GLOBAL', 'HOLDING', 'UNIT', 'PROJECT', 'USER'],
    example: 'GLOBAL',
    required: false,
    default: 'GLOBAL',
  })
  @IsOptional()
  @IsEnum(['GLOBAL', 'HOLDING', 'UNIT', 'PROJECT', 'USER'])
  scope?: string = 'GLOBAL';

  @ApiProperty({
    description: 'Reference ID for scoped configurations',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  referenceId?: number;

  @ApiProperty({
    description: 'Configuration description',
    example: 'Enable Magic Notebook feature for all users',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Is configuration active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Configuration metadata (JSON)',
    example: { defaultValue: 'true', allowedValues: ['true', 'false'] },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Display order',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}
