import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@ApiTags('sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({ status: 201, description: 'The section has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation failed.' })
  create(@Body() createSectionDto: CreateSectionDto) {
    // Logic to create a section
    return this.sectionsService.create(createSectionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all sections' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of sections.' })
  findAll() {
    // Logic to find all sections
    return this.sectionsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a section by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved section details.' })
  @ApiResponse({ status: 404, description: 'Not Found. Section not found.' })
  findOne(@Param('id') id: string) {
    // Logic to find one section by ID
    return this.sectionsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing section' })
  @ApiResponse({ status: 200, description: 'The section has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation failed.' })
  @ApiResponse({ status: 404, description: 'Not Found. Section not found.' })
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    // Logic to update a section
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a section by ID' })
  @ApiResponse({ status: 204, description: 'The section has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found. Section not found.' })
  remove(@Param('id') id: string) {
    // Logic to delete a section
    return this.sectionsService.remove(id);
  }
}