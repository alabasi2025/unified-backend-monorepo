import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateConversationDto } from './create-conversation.dto';

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  EXTRACTING = 'EXTRACTING',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export class UpdateConversationDto extends PartialType(CreateConversationDto) {
  @IsOptional()
  @IsEnum(ConversationStatus)
  status?: ConversationStatus;
}
