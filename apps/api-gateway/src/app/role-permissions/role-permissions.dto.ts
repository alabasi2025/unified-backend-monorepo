import { IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateRolePermissionDto {
  @IsUUID()
  roleId: string;

  @IsUUID()
  permissionId: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

// يمكن استخدام PartialType من @nestjs/mapped-types لإنشاء Update DTO
// ولكن سنقوم بإنشائه يدوياً لضمان عدم وجود اعتماديات خارجية غير ضرورية في هذا السياق
export class UpdateRolePermissionDto {
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsUUID()
  permissionId?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
