import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@ApiTags('notebooks')
@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new notebook' })
  @ApiResponse({ status: 201, description: 'The notebook has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createNotebookDto: CreateNotebookDto) {
    // In a real application, this would call the service layer to handle business logic and persistence
    return this.notebooksService.create(createNotebookDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all notebooks' })
  @ApiResponse({ status: 200, description: 'List of all notebooks.' })
  findAll() {
    return this.notebooksService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single notebook by ID' })
  @ApiResponse({ status: 200, description: 'The found notebook.' })
  @ApiResponse({ status: 404, description: 'Notebook not found.' })
  findOne(@Param('id') id: string) {
    return this.notebooksService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing notebook by ID' })
  @ApiResponse({ status: 200, description: 'The notebook has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Notebook not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateNotebookDto: UpdateNotebookDto) {
    return this.notebooksService.update(id, updateNotebookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a notebook by ID' })
  @ApiResponse({ status: 204, description: 'The notebook has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Notebook not found.' })
  remove(@Param('id') id: string) {
    // Note: NestJS will automatically return 204 No Content if the service method returns nothing (void)
    // or we can explicitly use @HttpCode(HttpStatus.NO_CONTENT)
    return this.notebooksService.remove(id);
  }
}

// ملاحظة: تم افتراض وجود ملفات DTOs و Service في نفس المجلد
// CreateNotebookDto, UpdateNotebookDto, NotebooksService
