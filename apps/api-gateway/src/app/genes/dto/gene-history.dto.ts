import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneHistoryDto {
  @ApiProperty()
  @IsString()
  geneId: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
