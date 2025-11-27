import { PartialType } from '@nestjs/swagger';
import { CreateArchiveDto } from './create-archive.dto';

export class UpdateArchiveDto extends PartialType(CreateArchiveDto) {}

// ملف create-archive.dto.ts (افتراضي)
/*
import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArchiveDto {
  @ApiProperty({ description: 'معرف الكيان المراد أرشفته (مثل Notebook ID)' })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ description: 'نوع الكيان المراد أرشفته (مثل Notebook)' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ description: 'حالة الأرشفة: صحيح للأرشفة، خطأ لإلغاء الأرشفة' })
  @IsBoolean()
  isArchived: boolean;
}
*/