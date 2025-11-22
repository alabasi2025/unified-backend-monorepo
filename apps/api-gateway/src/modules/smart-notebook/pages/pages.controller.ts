import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto, FilterPagesDto } from './dto/pages.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('api/smart-notebook/pages')
@UseGuards(JwtAuthGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto, @Request() req) {
    return this.pagesService.create(createPageDto, req.user.id);
  }

  @Get()
  findAll(@Query() filter: FilterPagesDto) {
    return this.pagesService.findAll(filter);
  }

  @Get('statistics')
  getStatistics() {
    return this.pagesService.getStatistics();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto, @Request() req) {
    return this.pagesService.update(id, updatePageDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }

  @Post(':id/toggle-favorite')
  toggleFavorite(@Param('id') id: string) {
    return this.pagesService.toggleFavorite(id);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string, @Request() req) {
    return this.pagesService.publish(id, req.user.id);
  }
}
