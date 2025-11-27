import { PartialType } from '@nestjs/swagger';
import { CreateNotebookDto } from './create-notebook.dto';

// نفترض أن CreateNotebookDto يحتوي على الحقول التالية:
// userId: string (IsUUID, IsNotEmpty)
// title: string (IsString, IsNotEmpty)
// description?: string (IsOptional, IsString)
// isArchived?: boolean (IsOptional, IsBoolean)
// color?: string (IsOptional, IsString)

export class UpdateNotebookDto extends PartialType(CreateNotebookDto) {}
