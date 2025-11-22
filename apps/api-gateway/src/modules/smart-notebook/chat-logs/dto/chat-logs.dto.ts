import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatTopic } from '@prisma/client';

export class CreateChatLogDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  messageCount?: number;

  @IsEnum(ChatTopic)
  topic: ChatTopic;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsString()
  pageId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateChatLogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  messageCount?: number;

  @IsOptional()
  @IsEnum(ChatTopic)
  topic?: ChatTopic;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsString()
  pageId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class FilterChatLogsDto {
  @IsOptional()
  @IsEnum(ChatTopic)
  topic?: ChatTopic;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

export class LinkToTaskDto {
  @IsString()
  taskId: string;
}

export class CreateTaskFromChatDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  priority?: string;
}
