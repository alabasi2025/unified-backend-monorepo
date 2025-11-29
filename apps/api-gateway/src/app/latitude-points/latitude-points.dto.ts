import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLatitudePointDto {
  @ApiProperty({ description: 'خط العرض للنقطة', example: 30.033333 })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ description: 'خط الطول للنقطة', example: 31.233334 })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({ description: 'اسم النقطة (يجب أن يكون فريدًا)', example: 'Cairo_Tower' })
  @IsString()
  @IsNotEmpty()
  point_name: string;
}

export class UpdateLatitudePointDto {
  @ApiProperty({ description: 'خط العرض للنقطة', example: 30.033333, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'خط الطول للنقطة', example: 31.233334, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'اسم النقطة (يجب أن يكون فريدًا)', example: 'Cairo_Tower_New', required: false })
  @IsString()
  @IsOptional()
  point_name?: string;
}
