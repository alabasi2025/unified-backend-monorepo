import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArchiveDto {
  @ApiProperty({ description: 'معرف المستخدم الذي يقوم بالأرشفة', example: 'user-uuid-123' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'معرف العنصر المراد أرشفته (مثل معرف المذكرة)', example: 'note-uuid-456' })
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @ApiProperty({ description: 'نوع العنصر المراد أرشفته (مثل "Note" أو "Folder")', example: 'Note' })
  @IsNotEmpty()
  @IsString()
  itemType: string;

  @ApiProperty({ description: 'ملاحظات إضافية حول الأرشفة', required: false, example: 'تمت الأرشفة لعدم الاستخدام' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'حالة الأرشفة (صحيح إذا كان مؤرشفًا)', required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
