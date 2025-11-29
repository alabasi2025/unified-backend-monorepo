import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VersionHistoryService } from './version-history.service';
import { CreateVersionHistoryDto } from './dto/create-version-history.dto';
import { UpdateVersionHistoryDto } from './dto/update-version-history.dto';

@ApiTags('version-history')
@Controller('version-history')
export class VersionHistoryController {
  constructor(private readonly versionHistoryService: VersionHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new version history record' })
  @ApiResponse({ status: 201, description: 'The version has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createVersionHistoryDto: CreateVersionHistoryDto) {
    return this.versionHistoryService.create(createVersionHistoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all version history or filter by page' })
  @ApiQuery({ name: 'pageId', required: false, description: 'Filter versions by page ID' })
  @ApiResponse({ status: 200, description: 'List of version history records.' })
  findAll(@Query('pageId') pageId?: string) {
    if (pageId) {
      return this.versionHistoryService.findByPageId(pageId);
    }
    return this.versionHistoryService.findAll();
  }

  @Get('latest/:pageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve the latest version for a specific page' })
  @ApiResponse({ status: 200, description: 'The latest version.' })
  @ApiResponse({ status: 404, description: 'No versions found for this page.' })
  findLatest(@Param('pageId') pageId: string) {
    return this.versionHistoryService.findLatestByPageId(pageId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single version history record by ID' })
  @ApiResponse({ status: 200, description: 'The found version.' })
  @ApiResponse({ status: 404, description: 'Version not found.' })
  findOne(@Param('id') id: string) {
    return this.versionHistoryService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing version history record by ID' })
  @ApiResponse({ status: 200, description: 'The version has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Version not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateVersionHistoryDto: UpdateVersionHistoryDto) {
    return this.versionHistoryService.update(id, updateVersionHistoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a version history record by ID' })
  @ApiResponse({ status: 204, description: 'The version has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Version not found.' })
  remove(@Param('id') id: string) {
    return this.versionHistoryService.remove(id);
  }
}
