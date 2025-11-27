import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from './role-permissions.entity';
import { CreateRolePermissionDto, UpdateRolePermissionDto } from './role-permissions.dto';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async create(createRolePermissionDto: CreateRolePermissionDto): Promise<RolePermission> {
    const rolePermission = this.rolePermissionRepository.create(createRolePermissionDto);
    return this.rolePermissionRepository.save(rolePermission);
  }

  async findAll(): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find({ relations: ['role', 'permission'] });
  }

  async findOne(id: string): Promise<RolePermission> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { id },
      relations: ['role', 'permission'],
    });
    if (!rolePermission) {
      throw new NotFoundException(`RolePermission with ID "${id}" not found`);
    }
    return rolePermission;
  }

  async update(id: string, updateRolePermissionDto: UpdateRolePermissionDto): Promise<RolePermission> {
    const rolePermission = await this.findOne(id); // Check if exists
    
    // Update the entity with the DTO data
    Object.assign(rolePermission, updateRolePermissionDto);

    return this.rolePermissionRepository.save(rolePermission);
  }

  async remove(id: string): Promise<void> {
    const result = await this.rolePermissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RolePermission with ID "${id}" not found`);
    }
  }
}
