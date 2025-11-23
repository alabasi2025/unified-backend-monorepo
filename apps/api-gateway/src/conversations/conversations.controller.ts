import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto, ConversationStatus } from './dto/update-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create(createConversationDto);
  }

  @Get()
  findAll(
    @Query('status') status?: ConversationStatus,
    @Query('category') category?: string,
    @Query('sourceRepo') sourceRepo?: string,
    @Query('search') search?: string,
  ) {
    return this.conversationsService.findAll({
      status,
      category,
      sourceRepo,
      search,
    });
  }

  @Get('statistics')
  getStatistics() {
    return this.conversationsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationsService.update(id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationsService.remove(id);
  }

  @Post(':id/archive')
  archive(@Param('id') id: string, @Body('updatedBy') updatedBy: string) {
    return this.conversationsService.archive(id, updatedBy);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Body('updatedBy') updatedBy: string) {
    return this.conversationsService.complete(id, updatedBy);
  }

  @Post('import')
  importFromFile(@Body() fileData: any) {
    return this.conversationsService.importFromFile(fileData);
  }
}
