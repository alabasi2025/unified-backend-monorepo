import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GenesService } from './genes.service';
import { CreateGeneDto, UpdateGeneDto } from './dto/genes.dto';

@Controller('genes')
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
}
