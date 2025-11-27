import { Module } from '@nestjs/common';
import { ChatLogsController } from './chat-logs.controller';
import { ChatLogsService } from './chat-logs.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ChatLogsController],
  providers: [ChatLogsService, PrismaService],
  exports: [ChatLogsService],
})
export class ChatLogsModule {}
