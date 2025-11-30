import { ApiProperty } from '@nestjs/swagger';

export class UsageReportDto {
  @ApiProperty()
  totalGenes: number;

  @ApiProperty()
  activeGenes: number;

  @ApiProperty()
  inactiveGenes: number;

  @ApiProperty()
  genesBySector: Record<string, number>;
}
