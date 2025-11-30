import { IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkUpdateGenesDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  geneIds: string[];

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
