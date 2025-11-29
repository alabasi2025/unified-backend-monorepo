import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new page' })
  @ApiBody({ type: CreatePageDto })
  @ApiResponse({ status: 201, description: 'The page has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createPageDto: CreatePageDto) {
    // Logic to create a page
    return this.pagesService.create(createPageDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all pages' })
  @ApiResponse({ status: 200, description: 'List of all pages.' })
  findAll() {
    // Logic to find all pages
    return this.pagesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a page by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the page', type: 'string' })
  @ApiResponse({ status: 200, description: 'The found page.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  findOne(@Param('id') id: string) {
    // Logic to find a single page
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a page by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the page', type: 'string' })
  @ApiBody({ type: UpdatePageDto })
  @ApiResponse({ status: 200, description: 'The page has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    // Logic to update a page
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a page by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the page', type: 'string' })
  @ApiResponse({ status: 204, description: 'The page has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  remove(@Param('id') id: string) {
    // Logic to delete a page
    return this.pagesService.remove(id);
  }
}

// DTOs (for completeness, assuming they are in ./dto/create-page.dto.ts and ./dto/update-page.dto.ts)
/*
// create-page.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePageDto {
  @ApiProperty({ description: 'Title of the page', example: 'My First Page' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content of the page', example: 'This is the content of the page.', required: false })
  @IsString()
  @IsOptional()
  content?: string;
}

// update-page.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePageDto } from './create-page.dto';

export class UpdatePageDto extends PartialType(CreatePageDto) {}
*/