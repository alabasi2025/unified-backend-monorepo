import { IsString, IsOptional, IsEnum, IsDateString, IsObject } from 'class-validator';

export enum TimelineEventType {
  CONVERSATION_CREATED = 'CONVERSATION_CREATED',
  CONVERSATION_UPDATED = 'CONVERSATION_UPDATED',
  CONVERSATION_ARCHIVED = 'CONVERSATION_ARCHIVED',
  IDEA_EXTRACTED = 'IDEA_EXTRACTED',
  IDEA_APPROVED = 'IDEA_APPROVED',
  IDEA_REJECTED = 'IDEA_REJECTED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_STARTED = 'TASK_STARTED',
  TASK_PROGRESS = 'TASK_PROGRESS',
  TASK_BLOCKED = 'TASK_BLOCKED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  NOTE_CREATED = 'NOTE_CREATED',
  NOTE_UPDATED = 'NOTE_UPDATED',
  REPORT_GENERATED = 'REPORT_GENERATED',
  OTHER = 'OTHER',
}

export class CreateTimelineEventDto {
  @IsEnum(TimelineEventType)
  eventType: TimelineEventType;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsString()
  ideaId?: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsString()
  pageId?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @IsString()
  createdBy: string;
}
