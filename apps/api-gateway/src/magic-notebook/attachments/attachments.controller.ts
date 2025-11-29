import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@ApiTags('attachments')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload a new attachment' })
  @ApiResponse({ status: 201, description: 'The attachment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createAttachmentDto: CreateAttachmentDto) {
    return this.attachmentsService.create(createAttachmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all attachments or filter by page' })
  @ApiQuery({ name: 'pageId', required: false, description: 'Filter attachments by page ID' })
  @ApiResponse({ status: 200, description: 'List of attachments.' })
  findAll(@Query('pageId') pageId?: string) {
    if (pageId) {
      return this.attachmentsService.findByPageId(pageId);
    }
    return this.attachmentsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single attachment by ID' })
  @ApiResponse({ status: 200, description: 'The found attachment.' })
  @ApiResponse({ status: 404, description: 'Attachment not found.' })
  findOne(@Param('id') id: string) {
    return this.attachmentsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing attachment by ID' })
  @ApiResponse({ status: 200, description: 'The attachment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Attachment not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateAttachmentDto: UpdateAttachmentDto) {
    return this.attachmentsService.update(id, updateAttachmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an attachment by ID' })
  @ApiResponse({ status: 204, description: 'The attachment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Attachment not found.' })
  remove(@Param('id') id: string) {
    return this.attachmentsService.remove(id);
  }
}
