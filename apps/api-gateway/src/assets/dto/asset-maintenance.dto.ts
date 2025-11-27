import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';

export class AssetMaintenanceDTO {
  @ApiProperty({ description: 'Asset ID', example: 1 })
  @IsInt()
  assetId: number;

  @ApiProperty({ description: 'Maintenance type', enum: ['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE'], example: 'PREVENTIVE' })
  @IsEnum(['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE'])
  maintenanceType: string;

  @ApiProperty({ description: 'Maintenance date', example: '2025-01-15' })
  @IsDateString()
  maintenanceDate: string;

  @ApiProperty({ description: 'Description', example: 'تغيير زيت وفلاتر' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Cost', example: 5000.0 })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({ description: 'Performed by', example: 'شركة الصيانة المتحدة', required: false })
  @IsOptional()
  @IsString()
  performedBy?: string;

  @ApiProperty({ description: 'Next maintenance date', example: '2025-04-15', required: false })
  @IsOptional()
  @IsDateString()
  nextMaintenanceDate?: string;

  @ApiProperty({ description: 'Status', enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], example: 'COMPLETED', required: false })
  @IsOptional()
  @IsEnum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: string;
}