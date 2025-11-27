import { IsString, IsOptional, IsBoolean, IsArray, ArrayMinSize, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIdeaDto {
  @ApiProperty({ description: 'عنوان الفكرة', example: 'تطبيق لإدارة المهام' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'وصف مفصل للفكرة', required: false, example: 'تطبيق ويب وهاتف لإدارة المهام والمشاريع الصغيرة.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'المستخدم الذي أنشأ الفكرة (يجب أن يكون UUID)', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'قائمة بالعلامات (Tags) المرتبطة بالفكرة', required: false, type: [String], example: ['تطوير', 'أفكار جديدة', 'تكنولوجيا'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  tags?: string[];

  @ApiProperty({ description: 'حالة الفكرة (هل هي مؤرشفة؟)', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
