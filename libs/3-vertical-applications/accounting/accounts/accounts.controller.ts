// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(
    @Query('accountType') accountType?: string,
    @Query('isActive') isActive?: string,
    @Query('isParent') isParent?: string,
  ) {
    return this.accountsService.findAll({
      accountType,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isParent: isParent === 'true' ? true : isParent === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.accountsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.accountsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }
}
