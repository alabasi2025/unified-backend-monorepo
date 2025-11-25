import { Controller, Post, Body } from '@nestjs/common';
import { SearchService } from './search.service';
@Controller('smart-notebook/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Post() search(@Body() data: { query: string }) { return this.searchService.search(data.query); }
}
