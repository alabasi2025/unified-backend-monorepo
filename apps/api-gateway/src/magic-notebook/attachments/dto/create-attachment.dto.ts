import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty({ description: 'ID of the page this attachment belongs to' })
  @IsString()
  @IsNotEmpty()
  pageId: string;

  @ApiProperty({ description: 'Original filename' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ description: 'File URL or path' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ description: 'MIME type of the file' })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber()
  fileSize: number;

  @ApiPropertyOptional({ description: 'User ID who uploaded the file' })
  @IsString()
  @IsOptional()
  uploadedBy?: string;
}
