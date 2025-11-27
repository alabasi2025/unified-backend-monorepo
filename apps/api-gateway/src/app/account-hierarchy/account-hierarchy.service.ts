import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountHierarchy } from './account_hierarchy.entity';
import { CreateAccountHierarchyDto, UpdateAccountHierarchyDto } from './account_hierarchy.dto';

@Injectable()
export class AccountHierarchyService {
  constructor(
    @InjectRepository(AccountHierarchy)
    private accountHierarchyRepository: Repository<AccountHierarchy>,
  ) {}

  // 1. إنشاء حساب جديد
  async create(createDto: CreateAccountHierarchyDto): Promise<AccountHierarchy> {
    // التحقق من وجود حساب أب إذا تم تحديده
    if (createDto.parentId) {
      const parent = await this.accountHierarchyRepository.findOne({ where: { id: createDto.parentId } });
      if (!parent) {
        throw new NotFoundException(`الحساب الأب بالمعرف ${createDto.parentId} غير موجود.`);
      }
      // التأكد من أن الحساب الأب ينتمي لنفس المؤسسة
      if (parent.institutionId !== createDto.institutionId) {
        throw new BadRequestException('الحساب الأب يجب أن ينتمي لنفس المؤسسة.');
      }
    }

    // التحقق من عدم تكرار الرمز (Code) ضمن المؤسسة
    const existingAccount = await this.accountHierarchyRepository.findOne({
      where: { code: createDto.code, institutionId: createDto.institutionId },
    });

    if (existingAccount) {
      throw new BadRequestException(`رمز الحساب ${createDto.code} موجود بالفعل في هذه المؤسسة.`);
    }

    const newAccount = this.accountHierarchyRepository.create(createDto);
    return this.accountHierarchyRepository.save(newAccount);
  }

  // 2. الحصول على جميع الحسابات (مع إمكانية التصفية حسب المؤسسة)
  findAll(institutionId?: string): Promise<AccountHierarchy[]> {
    const whereCondition = institutionId ? { institutionId } : {};
    return this.accountHierarchyRepository.find({
      where: whereCondition,
      relations: ['parent', 'accountType'], // جلب العلاقات
    });
  }

  // 3. الحصول على حساب واحد بالمعرف
  async findOne(id: string): Promise<AccountHierarchy> {
    const account = await this.accountHierarchyRepository.findOne({
      where: { id },
      relations: ['parent', 'accountType'],
    });
    if (!account) {
      throw new NotFoundException(`الحساب بالمعرف ${id} غير موجود.`);
    }
    return account;
  }

  // 4. تحديث حساب
  async update(id: string, updateDto: UpdateAccountHierarchyDto): Promise<AccountHierarchy> {
    const account = await this.findOne(id); // التحقق من وجود الحساب

    // التحقق من وجود حساب أب جديد إذا تم تحديده
    if (updateDto.parentId && updateDto.parentId !== account.parentId) {
      const parent = await this.accountHierarchyRepository.findOne({ where: { id: updateDto.parentId } });
      if (!parent) {
        throw new NotFoundException(`الحساب الأب بالمعرف ${updateDto.parentId} غير موجود.`);
      }
      // التأكد من أن الحساب الأب ينتمي لنفس المؤسسة (أو المؤسسة المحدثة)
      const targetInstitutionId = updateDto.institutionId || account.institutionId;
      if (parent.institutionId !== targetInstitutionId) {
        throw new BadRequestException('الحساب الأب يجب أن ينتمي لنفس المؤسسة.');
      }
    }

    // التحقق من عدم تكرار الرمز (Code) إذا تم تحديثه
    if (updateDto.code && updateDto.code !== account.code) {
      const targetInstitutionId = updateDto.institutionId || account.institutionId;
      const existingAccount = await this.accountHierarchyRepository.findOne({
        where: { code: updateDto.code, institutionId: targetInstitutionId },
      });

      if (existingAccount && existingAccount.id !== id) {
        throw new BadRequestException(`رمز الحساب ${updateDto.code} موجود بالفعل في هذه المؤسسة.`);
      }
    }

    Object.assign(account, updateDto);
    return this.accountHierarchyRepository.save(account);
  }

  // 5. حذف حساب
  async remove(id: string): Promise<void> {
    const result = await this.accountHierarchyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`الحساب بالمعرف ${id} غير موجود.`);
    }
  }
}
