import { IsString, IsOptional, IsBoolean, IsHexColor, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// 1. Base DTO (CreateStickyNoteDto) - Used internally for PartialType
class CreateStickyNoteDto {
  @ApiProperty({ description: 'ID of the user who owns the sticky note' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'The content of the sticky note' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false, description: 'Color of the sticky note (e.g., hex code)' })
  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string;

  @ApiProperty({ required: false, description: 'Whether the sticky note is pinned' })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

// 2. Target DTO (UpdateStickyNoteDto) - Uses PartialType
export class UpdateStickyNoteDto extends PartialType(CreateStickyNoteDto) {}
