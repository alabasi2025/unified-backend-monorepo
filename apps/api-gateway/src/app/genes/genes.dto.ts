import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateGeneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateGeneDto extends PartialType(CreateGeneDto) {}
