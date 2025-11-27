import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AccountHierarchyService } from './account_hierarchy.service';
import { CreateAccountHierarchyDto, UpdateAccountHierarchyDto } from './account_hierarchy.dto';
import { AccountHierarchy } from './account_hierarchy.entity';

@Controller('account-hierarchy')
export class AccountHierarchyController {
  constructor(private readonly accountHierarchyService: AccountHierarchyService) {}

  // POST /account-hierarchy
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateAccountHierarchyDto): Promise<AccountHierarchy> {
    return this.accountHierarchyService.create(createDto);
  }

  // GET /account-hierarchy?institutionId=...
  @Get()
  findAll(@Query('institutionId') institutionId?: string): Promise<AccountHierarchy[]> {
    return this.accountHierarchyService.findAll(institutionId);
  }

  // GET /account-hierarchy/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<AccountHierarchy> {
    return this.accountHierarchyService.findOne(id);
  }

  // PUT /account-hierarchy/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAccountHierarchyDto): Promise<AccountHierarchy> {
    return this.accountHierarchyService.update(id, updateDto);
  }

  // DELETE /account-hierarchy/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.accountHierarchyService.remove(id);
  }
}
