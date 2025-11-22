import { Module } from '@nestjs/common';
import { ChatLogsService } from './chat-logs.service';
import { ChatLogsController } from './chat-logs.controller';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChatLogsController],
  providers: [ChatLogsService],
  exports: [ChatLogsService],
})
export class ChatLogsModule {}
