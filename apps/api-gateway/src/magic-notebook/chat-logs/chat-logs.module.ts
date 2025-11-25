import { Module } from '@nestjs/common';
import { ChatLogsController } from './chat-logs.controller';
import { ChatLogsService } from './chat-logs.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChatLogsController],
  providers: [ChatLogsService],
  exports: [ChatLogsService],
})
export class ChatLogsModule {}
