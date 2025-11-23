import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NotebookPagesService } from './pages.service';
import { CreateNotebookPageDto, UpdateNotebookPageDto } from './dto/notebook-page.dto';

@Controller('notebook/pages')
export class NotebookPagesController {
  constructor(private readonly pagesService: NotebookPagesService) {}

  @Post()
  create(@Body() createDto: CreateNotebookPageDto) {
    return this.pagesService.create(createDto);
  }

  @Get()
  findAll(
    @Query('section') section?: string,
    @Query('isPinned') isPinned?: string,
    @Query('isArchived') isArchived?: string,
    @Query('isFavorite') isFavorite?: string,
    @Query('createdBy') createdBy?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    
    if (section) filters.section = section;
    if (isPinned) filters.isPinned = isPinned === 'true';
    if (isArchived) filters.isArchived = isArchived === 'true';
    if (isFavorite) filters.isFavorite = isFavorite === 'true';
    if (createdBy) filters.createdBy = createdBy;
    if (search) filters.search = search;

    return this.pagesService.findAll(filters);
  }

  @Get('sections')
  getSections(@Query('createdBy') createdBy?: string) {
    return this.pagesService.getSections(createdBy);
  }

  @Get('statistics')
  getStatistics(@Query('createdBy') createdBy?: string) {
    return this.pagesService.getStatistics(createdBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateNotebookPageDto) {
    return this.pagesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }
}
