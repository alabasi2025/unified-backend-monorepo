import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';
import { ItemCategoryDto } from './dto/item-category.dto';

// محاكاة لقاعدة البيانات
let categories: ItemCategoryDto[] = [
  { id: 1, name: 'أدوات كهربائية', description: 'جميع الأدوات الكهربائية', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'مواد بناء', description: 'الأسمنت والحديد والرمل', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: 'أثاث مكتبي', description: 'طاولات وكراسي وخزائن', isActive: false, createdAt: new Date(), updatedAt: new Date() },
];
let nextId = 4;

@Injectable()
export class ItemCategoriesService {
  /**
   * إنشاء صنف جديد
   * @param createItemCategoryDto بيانات الصنف الجديد
   * @returns الصنف المنشأ
   */
  create(createItemCategoryDto: CreateItemCategoryDto): ItemCategoryDto {
    const newCategory: ItemCategoryDto = {
      id: nextId++,
      ...createItemCategoryDto,
      isActive: createItemCategoryDto.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    categories.push(newCategory);
    return newCategory;
  }

  /**
   * جلب جميع الأصناف
   * @returns قائمة الأصناف
   */
  findAll(): ItemCategoryDto[] {
    return categories;
  }

  /**
   * جلب صنف معين بالمعرف
   * @param id معرف الصنف
   * @returns الصنف المطلوب
   */
  findOne(id: number): ItemCategoryDto {
    const category = categories.find(c => c.id === id);
    if (!category) {
      throw new NotFoundException(`لم يتم العثور على الصنف بالمعرف ${id}`);
    }
    return category;
  }

  /**
   * تحديث بيانات صنف
   * @param id معرف الصنف
   * @param updateItemCategoryDto البيانات المراد تحديثها
   * @returns الصنف المحدث
   */
  update(id: number, updateItemCategoryDto: UpdateItemCategoryDto): ItemCategoryDto {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`لم يتم العثور على الصنف بالمعرف ${id}`);
    }

    categories[index] = {
      ...categories[index],
      ...updateItemCategoryDto,
      updatedAt: new Date(),
    };

    return categories[index];
  }

  /**
   * حذف صنف
   * @param id معرف الصنف
   */
  remove(id: number): void {
    const initialLength = categories.length;
    categories = categories.filter(c => c.id !== id);
    if (categories.length === initialLength) {
      throw new NotFoundException(`لم يتم العثور على الصنف بالمعرف ${id}`);
    }
  }
}
