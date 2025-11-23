import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StickyNotesService } from './sticky-notes.service';
import { CreateStickyNoteDto, UpdateStickyNoteDto } from './dto/sticky-note.dto';

@Controller('notebook/sticky-notes')
export class StickyNotesController {
  constructor(private readonly stickyNotesService: StickyNotesService) {}

  @Post()
  create(@Body() createDto: CreateStickyNoteDto) {
    return this.stickyNotesService.create(createDto);
  }

  @Get()
  findAll(
    @Query('pageId') pageId?: string,
    @Query('conversationId') conversationId?: string,
    @Query('ideaId') ideaId?: string,
    @Query('taskId') taskId?: string,
    @Query('isDismissed') isDismissed?: string,
    @Query('createdBy') createdBy?: string,
  ) {
    const filters: any = {};
    
    if (pageId) filters.pageId = pageId;
    if (conversationId) filters.conversationId = conversationId;
    if (ideaId) filters.ideaId = ideaId;
    if (taskId) filters.taskId = taskId;
    if (isDismissed) filters.isDismissed = isDismissed === 'true';
    if (createdBy) filters.createdBy = createdBy;

    return this.stickyNotesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stickyNotesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateStickyNoteDto) {
    return this.stickyNotesService.update(id, updateDto);
  }

  @Patch(':id/dismiss')
  dismiss(@Param('id') id: string) {
    return this.stickyNotesService.dismiss(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.stickyNotesService.restore(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stickyNotesService.remove(id);
  }
}
