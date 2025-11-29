import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVersionHistoryDto {
  @ApiProperty({ description: 'ID of the page this version belongs to' })
  @IsString()
  @IsNotEmpty()
  pageId: string;

  @ApiProperty({ description: 'Version number' })
  @IsNumber()
  versionNumber: number;

  @ApiProperty({ description: 'Page content at this version' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Change description or notes' })
  @IsString()
  @IsOptional()
  changeDescription?: string;

  @ApiPropertyOptional({ description: 'User ID who created this version' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
