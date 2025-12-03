import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneDependencyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  geneId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dependsOnGeneId: string;
}
