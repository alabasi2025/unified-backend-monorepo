import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Placeholder DTOs
class CreateIdeaDto {
  readonly title: string;
  readonly content: string;
}

class UpdateIdeaDto {
  readonly title?: string;
  readonly content?: string;
}

// Placeholder Service
class IdeasService {
  create(createIdeaDto: CreateIdeaDto) {
    return `This action adds a new idea: ${createIdeaDto.title}`;
  }

  findAll() {
    return `This action returns all ideas`;
  }

  findOne(id: string) {
    return `This action returns a #${id} idea`;
  }

  update(id: string, updateIdeaDto: UpdateIdeaDto) {
    return `This action updates a #${id} idea with: ${updateIdeaDto.title}`;
  }

  remove(id: string) {
    return `This action removes a #${id} idea`;
  }
}

@ApiTags('ideas')
@Controller('ideas')
export class IdeasController {
  // Assuming the service is injected
  constructor(private readonly ideasService: IdeasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new idea' })
  @ApiResponse({ status: 201, description: 'The idea has been successfully created.' })
  create(@Body() createIdeaDto: CreateIdeaDto) {
    // In a real application, the DTO would be validated here
    return this.ideasService.create(createIdeaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all ideas' })
  @ApiResponse({ status: 200, description: 'Return all ideas.' })
  findAll() {
    return this.ideasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single idea by ID' })
  @ApiResponse({ status: 200, description: 'Return a single idea.' })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  findOne(@Param('id') id: string) {
    return this.ideasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing idea' })
  @ApiResponse({ status: 200, description: 'The idea has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  update(@Param('id') id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
    return this.ideasService.update(id, updateIdeaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content is common for successful deletion
  @ApiOperation({ summary: 'Delete an idea by ID' })
  @ApiResponse({ status: 204, description: 'The idea has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  remove(@Param('id') id: string) {
    return this.ideasService.remove(id);
  }
}