import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateStickyNoteDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsObject()
  position?: { x: number; y: number };

  @IsOptional()
  @IsObject()
  size?: { width: number; height: number };

  @IsOptional()
  @IsString()
  pageId?: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsString()
  ideaId?: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsString()
  createdBy: string;
}

export class UpdateStickyNoteDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsObject()
  position?: { x: number; y: number };

  @IsOptional()
  @IsObject()
  size?: { width: number; height: number };

  @IsOptional()
  @IsBoolean()
  isDismissed?: boolean;
}
