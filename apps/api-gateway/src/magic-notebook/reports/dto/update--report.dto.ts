import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Define the base DTO (CreateReportDto) for PartialType to use
export class CreateReportDto {
  @ApiProperty({ description: 'ID of the user creating the report' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Title of the report' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content of the report' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Whether the report is public or not', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ description: 'List of tags for the report', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

// The Update DTO uses PartialType of the Create DTO
export class UpdateReportDto extends PartialType(CreateReportDto) {}
