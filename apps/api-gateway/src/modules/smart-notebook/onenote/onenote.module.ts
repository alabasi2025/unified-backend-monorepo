import { Module } from '@nestjs/common';
import { OneNoteController } from './onenote.controller';
import { OneNoteService } from './onenote.service';

@Module({
  controllers: [OneNoteController],
  providers: [OneNoteService],
  exports: [OneNoteService],
})
export class OneNoteModule {}
