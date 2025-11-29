import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { GenesService } from './genes.service';

export interface CreateGeneDto {
  code: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  category: string;
  geneType: 'PUBLIC' | 'PRIVATE';
  sectorId?: string;
  features?: any[];
}

export interface ActivateGeneDto {
  holdingId: string;
  config?: any;
}

@Controller('genes')
export class GenesController {
  constructor(private readonly genesService: GenesService) {}

  @Get()
  findAll(@Query('category') category?: string, @Query('geneType') geneType?: string) {
    return this.genesService.findAll(category, geneType);
  }

  @Get('available')
  getAvailableGenes(@Query('holdingId') holdingId: string) {
    return this.genesService.getAvailableGenes(holdingId);
  }

  @Get('active')
  getActiveGenes(@Query('holdingId') holdingId: string) {
    return this.genesService.getActiveGenes(holdingId);
  }

  @Get('sectors')
  getAllSectors() {
    return this.genesService.getAllSectors();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genesService.findOne(id);
  }

  @Post()
  create(@Body() createGeneDto: CreateGeneDto) {
    return this.genesService.create(createGeneDto);
  }

  @Post(':id/activate')
  activate(@Param('id') id: string, @Body() activateDto: ActivateGeneDto) {
    return this.genesService.activate(id, activateDto);
  }

  @Post(':id/deactivate')
  deactivate(@Param('id') id: string, @Body() body: { holdingId: string }) {
    return this.genesService.deactivate(id, body.holdingId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneDto: Partial<CreateGeneDto>) {
    return this.genesService.update(id, updateGeneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genesService.remove(id);
  }
}
