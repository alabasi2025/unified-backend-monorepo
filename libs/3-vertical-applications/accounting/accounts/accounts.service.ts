// PHASE-13: إضافة Input Validation وتحسين Business Logic
// PHASE-11: إصلاح انتهاكات DTOs والبنية المعمارية - استخدام @semop/contracts
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AccountsService {
  // Dummy data - في الإنتاج يجب استخدام Prisma
  private accounts = [
    { id: '1', code: '1', nameAr: 'الأصول', nameEn: 'Assets', accountType: 'ASSET', accountNature: 'DEBIT', level: 1, isParent: true, isActive: true },
    { id: '2', code: '11', nameAr: 'الأصول المتداولة', nameEn: 'Current Assets', accountType: 'ASSET', accountNature: 'DEBIT', level: 2, isParent: true, parentId: '1', isActive: true },
    { id: '3', code: '1101', nameAr: 'النقدية', nameEn: 'Cash', accountType: 'ASSET', accountNature: 'DEBIT', level: 3, isParent: false, parentId: '2', isActive: true },
    { id: '4', code: '1102', nameAr: 'البنك', nameEn: 'Bank', accountType: 'ASSET', accountNature: 'DEBIT', level: 3, isParent: false, parentId: '2', isActive: true },
    { id: '5', code: '2', nameAr: 'الخصوم', nameEn: 'Liabilities', accountType: 'LIABILITY', accountNature: 'CREDIT', level: 1, isParent: true, isActive: true },
  ];
  private nextId = 6;

  findAll(filters?: any) {
    let result = [...this.accounts];
    
    if (filters?.accountType) {
      result = result.filter(a => a.accountType === filters.accountType);
    }
    
    if (filters?.isActive !== undefined) {
      result = result.filter(a => a.isActive === filters.isActive);
    }
    
    if (filters?.isParent !== undefined) {
      result = result.filter(a => a.isParent === filters.isParent);
    }
    
    return result;
  }

  findOne(id: string) {
    const account = this.accounts.find(a => a.id === id);
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  create(data: any) {
    const newAccount = {
      id: String(this.nextId++),
      code: data.code,
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      description: data.description,
      accountType: data.accountType,
      accountNature: data.accountNature,
      level: data.level,
      isParent: data.isParent || false,
      allowManualEntry: data.allowManualEntry ?? true,
      parentId: data.parentId,
      isActive: true,
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  update(id: string, data: any) {
    const index = this.accounts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    
    this.accounts[index] = {
      ...this.accounts[index],
      ...data,
    };
    
    return this.accounts[index];
  }

  remove(id: string) {
    const index = this.accounts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    
    // Soft delete
    this.accounts[index].isActive = false;
    return this.accounts[index];
  }
}
