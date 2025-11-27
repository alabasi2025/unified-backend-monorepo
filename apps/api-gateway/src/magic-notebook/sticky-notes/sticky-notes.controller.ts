import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StickyNotesService } from './sticky-notes.service';
import { CreateStickyNoteDto } from './dto/create-sticky-note.dto';
import { UpdateStickyNoteDto } from './dto/update-sticky-note.dto';

@ApiTags('sticky-notes')
@Controller('sticky-notes')
export class StickyNotesController {
  constructor(private readonly stickyNotesService: StickyNotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new sticky note' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The sticky note has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  create(@Body() createStickyNoteDto: CreateStickyNoteDto) {
    // Logic to create a sticky note
    return this.stickyNotesService.create(createStickyNoteDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all sticky notes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all sticky notes.' })
  findAll() {
    // Logic to find all sticky notes
    return this.stickyNotesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a sticky note by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The sticky note details.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Sticky note not found.' })
  findOne(@Param('id') id: string) {
    // Logic to find a sticky note by ID
    return this.stickyNotesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing sticky note' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The sticky note has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Sticky note not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  update(@Param('id') id: string, @Body() updateStickyNoteDto: UpdateStickyNoteDto) {
    // Logic to update a sticky note
    return this.stickyNotesService.update(id, updateStickyNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a sticky note by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The sticky note has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Sticky note not found.' })
  remove(@Param('id') id: string) {
    // Logic to delete a sticky note
    return this.stickyNotesService.remove(id);
  }
}
