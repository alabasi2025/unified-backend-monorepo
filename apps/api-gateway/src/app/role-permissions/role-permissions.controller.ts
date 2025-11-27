import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto, UpdateRolePermissionDto } from './role-permissions.dto';
import { RolePermission } from './role-permissions.entity';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRolePermissionDto: CreateRolePermissionDto): Promise<RolePermission> {
    return this.rolePermissionsService.create(createRolePermissionDto);
  }

  @Get()
  findAll(): Promise<RolePermission[]> {
    return this.rolePermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<RolePermission> {
    return this.rolePermissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolePermissionDto: UpdateRolePermissionDto): Promise<RolePermission> {
    return this.rolePermissionsService.update(id, updateRolePermissionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.rolePermissionsService.remove(id);
  }
}
