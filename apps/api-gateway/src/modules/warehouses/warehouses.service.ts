import { Injectable, NotFoundException } from '@nestjs/common';

export interface Warehouse {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  location: string;
  managerId: string;
  managerName: string;
  capacity: number;
  currentStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

@Injectable()
export class WarehousesService {
  private warehouses: Warehouse[] = [
    {
      id: '1',
      code: 'WH-001',
      nameAr: 'المستودع الرئيسي',
      nameEn: 'Main Warehouse',
      location: 'صنعاء - شارع الزبيري',
      managerId: '1',
      managerName: 'أحمد محمد',
      capacity: 10000,
      currentStock: 7500,
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      code: 'WH-002',
      nameAr: 'مستودع عدن',
      nameEn: 'Aden Warehouse',
      location: 'عدن - المعلا',
      managerId: '2',
      managerName: 'علي حسن',
      capacity: 5000,
      currentStock: 3200,
      isActive: true,
      createdAt: '2025-02-01'
    },
    {
      id: '3',
      code: 'WH-003',
      nameAr: 'مستودع تعز',
      nameEn: 'Taiz Warehouse',
      location: 'تعز - شارع جمال',
      managerId: '3',
      managerName: 'محمد علي',
      capacity: 3000,
      currentStock: 1800,
      isActive: true,
      createdAt: '2025-03-01'
    },
    {
      id: '4',
      code: 'WH-004',
      nameAr: 'مستودع الحديدة',
      nameEn: 'Hodeidah Warehouse',
      location: 'الحديدة - الميناء',
      managerId: '4',
      managerName: 'خالد أحمد',
      capacity: 8000,
      currentStock: 5600,
      isActive: true,
      createdAt: '2025-04-01'
    },
    {
      id: '5',
      code: 'WH-005',
      nameAr: 'مستودع إب',
      nameEn: 'Ibb Warehouse',
      location: 'إب - المدينة',
      managerId: '5',
      managerName: 'عبدالله محمد',
      capacity: 2000,
      currentStock: 1200,
      isActive: false,
      createdAt: '2025-05-01'
    }
  ];

  findAll(): Warehouse[] {
    return this.warehouses.filter(w => !w['isDeleted']);
  }

  findOne(id: string): Warehouse {
    const warehouse = this.warehouses.find(w => w.id === id && !w['isDeleted']);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  create(createWarehouseDto: any): Warehouse {
    const newWarehouse: Warehouse = {
      id: String(this.warehouses.length + 1),
      code: createWarehouseDto.code,
      nameAr: createWarehouseDto.nameAr,
      nameEn: createWarehouseDto.nameEn || '',
      location: createWarehouseDto.location || '',
      managerId: createWarehouseDto.managerId || '',
      managerName: 'مدير جديد',
      capacity: createWarehouseDto.capacity || 0,
      currentStock: 0,
      isActive: createWarehouseDto.isActive !== undefined ? createWarehouseDto.isActive : true,
      createdAt: new Date().toISOString()
    };
    this.warehouses.push(newWarehouse);
    return newWarehouse;
  }

  update(id: string, updateWarehouseDto: any): Warehouse {
    const warehouse = this.findOne(id);
    Object.assign(warehouse, {
      ...updateWarehouseDto,
      updatedAt: new Date().toISOString()
    });
    return warehouse;
  }

  remove(id: string): Warehouse {
    const warehouse = this.findOne(id);
    warehouse['isDeleted'] = true;
    return warehouse;
  }
}
