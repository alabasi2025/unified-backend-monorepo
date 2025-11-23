import { IsString, IsEnum, IsInt, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export enum AchievementReportType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  PROJECT = 'PROJECT',
  TEAM = 'TEAM',
  CUSTOM = 'CUSTOM',
}

export class CreateAchievementReportDto {
  @IsString()
  title: string;

  @IsEnum(AchievementReportType)
  type: AchievementReportType;

  @IsString()
  period: string;

  @IsInt()
  @Min(0)
  totalTasks: number;

  @IsInt()
  @Min(0)
  completedTasks: number;

  @IsNumber()
  @Min(0)
  progressPercentage: number;

  @IsInt()
  @Min(0)
  totalIdeas: number;

  @IsInt()
  @Min(0)
  convertedIdeas: number;

  @IsInt()
  @Min(0)
  totalConversations: number;

  @IsInt()
  @Min(0)
  processedConversations: number;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  recommendations?: string;

  @IsOptional()
  @IsString()
  highlights?: string;

  @IsOptional()
  @IsString()
  challenges?: string;

  @IsOptional()
  @IsString()
  team?: string;

  @IsOptional()
  @IsString()
  project?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  createdBy: string;

  @IsOptional()
  taskIds?: string[];
}
