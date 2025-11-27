import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new search entry' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The search entry has been successfully created.' })
  create(@Body() createSearchDto: CreateSearchDto) {
    // In a real search module, 'create' might log a search query or save a search filter.
    return this.searchService.create(createSearchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all search entries or perform a general search' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all search entries or search results.' })
  findAll() {
    // This could be used to list saved searches or recent search history.
    return this.searchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific search entry by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The found search entry.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search entry not found.' })
  findOne(@Param('id') id: string) {
    // This could be used to retrieve a specific saved search filter.
    return this.searchService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific search entry by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The search entry has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search entry not found.' })
  update(@Param('id') id: string, @Body() updateSearchDto: UpdateSearchDto) {
    // This could be used to rename or modify a saved search filter.
    return this.searchService.update(+id, updateSearchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific search entry by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The search entry has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search entry not found.' })
  remove(@Param('id') id: string) {
    // This could be used to delete a saved search filter or clear a history item.
    return this.searchService.remove(+id);
  }
}
