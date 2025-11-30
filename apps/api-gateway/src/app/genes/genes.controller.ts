import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GenesService } from './genes.service';
import { CreateGeneDto, UpdateGeneDto } from './dto/genes.dto';
import { LinkGeneSectorDto } from './dto/link-gene-sector.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('genes')
@ApiTags('genes')
export class GenesController {
  constructor(private readonly genesService: GenesService) {}

  @Post()
  create(@Body() createGeneDto: CreateGeneDto) {
    return this.genesService.create(createGeneDto);
  }

  @Get()
  findAll() {
    return this.genesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGeneDto: UpdateGeneDto) {
    return this.genesService.update(id, updateGeneDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genesService.remove(id);
  }

  @Post(':id/sector')
  @ApiOperation({ summary: 'ربط الجين بقطاع معين' })
  @ApiResponse({ status: 200, description: 'تم ربط الجين بالقطاع بنجاح' })
  @ApiResponse({ status: 404, description: 'الجين غير موجود' })
  linkToSector(
    @Param('id', ParseIntPipe) id: number,
    @Body() linkGeneSectorDto: LinkGeneSectorDto,
  ) {
    return this.genesService.linkGeneToSector(id, linkGeneSectorDto.sectorCode);
  }

  @Get('by-sector/:sectorCode')
  @ApiOperation({ summary: 'الحصول على جميع الجينات المرتبطة بقطاع معين' })
  @ApiResponse({ status: 200, description: 'قائمة الجينات المرتبطة بالقطاع' })
  getGenesBySector(@Param('sectorCode') sectorCode: string) {
    return this.genesService.getGenesBySector(sectorCode);
  }

  @Get('available')
  @ApiOperation({ summary: 'الحصول على الجينات المتاحة للشركة' })
  @ApiResponse({ status: 200, description: 'قائمة الجينات المتاحة' })
  getAvailableGenes() {
    return this.genesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'الحصول على الجينات النشطة' })
  @ApiResponse({ status: 200, description: 'قائمة الجينات النشطة' })
  getActiveGenes() {
    return this.genesService.getActiveGenes();
  }

  @Get('sectors')
  @ApiOperation({ summary: 'الحصول على جميع القطاعات' })
  @ApiResponse({ status: 200, description: 'قائمة القطاعات' })
  getAllSectors() {
    return this.genesService.getAllSectors();
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'تفعيل جين معين' })
  @ApiResponse({ status: 200, description: 'تم تفعيل الجين بنجاح' })
  activateGene(@Param('id', ParseIntPipe) id: number) {
    return this.genesService.activateGene(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'تعطيل جين معين' })
  @ApiResponse({ status: 200, description: 'تم تعطيل الجين بنجاح' })
  deactivateGene(@Param('id', ParseIntPipe) id: number) {
    return this.genesService.deactivateGene(id);
  }
}
