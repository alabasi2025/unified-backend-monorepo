import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';

export enum ConversationCategory {
  ARCHITECTURE = 'ARCHITECTURE',
  FEATURE = 'FEATURE',
  IMPROVEMENT = 'IMPROVEMENT',
  BUG_FIX = 'BUG_FIX',
  DOCUMENTATION = 'DOCUMENTATION',
  PLANNING = 'PLANNING',
  GUIDE = 'GUIDE',
  REPORT = 'REPORT',
  OTHER = 'OTHER',
}

export class CreateConversationDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  sourceFile?: string;

  @IsOptional()
  @IsString()
  sourcePath?: string;

  @IsOptional()
  @IsString()
  sourceRepo?: string;

  @IsEnum(ConversationCategory)
  category: ConversationCategory;

  @IsOptional()
  @IsInt()
  @Min(0)
  fileSize?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  linesCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  wordsCount?: number;

  @IsString()
  createdBy: string;
}
