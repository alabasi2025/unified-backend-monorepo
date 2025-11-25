import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AccountService } from '../../../../../1-core-services/accounting/src/lib/services/account.service';
import { AccountType, AccountNature } from '@prisma/client';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async findAll(
    @Query('accountType') accountType?: AccountType,
    @Query('isActive') isActive?: string,
    @Query('isParent') isParent?: string,
    @Query('institutionId') institutionId?: string, // إضافة institutionId
  ) {
    return this.accountService.findAll({
      accountType,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isParent: isParent === 'true' ? true : isParent === 'false' ? false : undefined,
      institutionId, // إضافة institutionId
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Post()
  async create(@Body() data: {
    code: string;
    nameAr: string;
    nameEn: string;
    description?: string;
    accountType: AccountType;
    accountNature: AccountNature;
    level: number;
    isParent?: boolean;
    allowManualEntry?: boolean;
    parentId?: string;
    holdingId?: string;
    unitId?: string;
    institutionId?: string; // إضافة institutionId
  }) {
    return this.accountService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: {
      code?: string;
      nameAr?: string;
      nameEn?: string;
      description?: string;
      isActive?: boolean;
      allowManualEntry?: boolean;
    }
  ) {
    return this.accountService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
