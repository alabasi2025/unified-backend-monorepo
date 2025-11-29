import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArchiveService } from './archive.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

// DTOs (Data Transfer Objects) - افتراض وجودها في ملفات منفصلة
// class CreateArchiveDto { /* ... */ }
// class UpdateArchiveDto { /* ... */ }

@ApiTags('archive')
@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new archived item' })
  @ApiResponse({ status: 201, description: 'The item has been successfully archived.' })
  create(@Body() createArchiveDto: CreateArchiveDto) {
    // هنا يتم استدعاء خدمة الأرشفة لإنشاء عنصر جديد
    return this.archiveService.create(createArchiveDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all archived items' })
  @ApiResponse({ status: 200, description: 'List of all archived items.' })
  findAll() {
    // هنا يتم استدعاء خدمة الأرشفة لجلب جميع العناصر
    return this.archiveService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single archived item by ID' })
  @ApiResponse({ status: 200, description: 'The found archived item.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  findOne(@Param('id') id: string) {
    // هنا يتم استدعاء خدمة الأرشفة لجلب عنصر واحد
    return this.archiveService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing archived item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  update(@Param('id') id: string, @Body() updateArchiveDto: UpdateArchiveDto) {
    // هنا يتم استدعاء خدمة الأرشفة لتحديث عنصر
    return this.archiveService.update(id, updateArchiveDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an archived item by ID' })
  @ApiResponse({ status: 204, description: 'The item has been successfully removed.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  remove(@Param('id') id: string) {
    // هنا يتم استدعاء خدمة الأرشفة لحذف عنصر
    return this.archiveService.remove(id);
  }
}
