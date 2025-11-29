import { Injectable, NotFoundException } from '@nestjs/common';

export interface StockMovement {
  id: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  unitPrice?: number;
  totalValue?: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  isDeleted?: boolean;
}

export interface StockMovementFilters {
  warehouseId?: string;
  itemId?: string;
  movementType?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export interface StockMovementStatistics {
  totalIncoming: number;
  totalOutgoing: number;
  movementsToday: number;
  totalMovements: number;
  byMovementType?: {
    IN: number;
    OUT: number;
    TRANSFER: number;
    ADJUSTMENT: number;
  };
}

@Injectable()
export class StockMovementsService {
  private movements: StockMovement[] = [
    {
      id: '1',
      warehouseId: '1',
      warehouseName: 'المستودع الرئيسي',
      itemId: '1',
      itemCode: 'ITEM-001',
      itemName: 'لابتوب Dell Latitude',
      movementType: 'IN',
      quantity: 50,
      unitPrice: 800,
      totalValue: 40000,
      referenceType: 'PURCHASE_ORDER',
      referenceId: 'PO-001',
      notes: 'استلام شحنة جديدة',
      createdBy: 'أحمد محمد',
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      id: '2',
      warehouseId: '1',
      warehouseName: 'المستودع الرئيسي',
      itemId: '2',
      itemCode: 'ITEM-002',
      itemName: 'شاشة Samsung 27"',
      movementType: 'OUT',
      quantity: 10,
      unitPrice: 250,
      totalValue: 2500,
      referenceType: 'SALES_ORDER',
      referenceId: 'SO-001',
      notes: 'بيع للعميل ABC',
      createdBy: 'علي حسن',
      createdAt: '2025-01-16T14:20:00Z'
    },
    {
      id: '3',
      warehouseId: '2',
      warehouseName: 'مستودع عدن',
      itemId: '3',
      itemCode: 'ITEM-003',
      itemName: 'طابعة HP LaserJet',
      movementType: 'IN',
      quantity: 20,
      unitPrice: 300,
      totalValue: 6000,
      referenceType: 'PURCHASE_ORDER',
      referenceId: 'PO-002',
      notes: 'استلام من المورد XYZ',
      createdBy: 'محمد علي',
      createdAt: '2025-02-01T09:15:00Z'
    },
    {
      id: '4',
      warehouseId: '1',
      warehouseName: 'المستودع الرئيسي',
      itemId: '1',
      itemCode: 'ITEM-001',
      itemName: 'لابتوب Dell Latitude',
      movementType: 'TRANSFER',
      quantity: 15,
      unitPrice: 800,
      totalValue: 12000,
      referenceType: 'TRANSFER',
      referenceId: 'TR-001',
      notes: 'نقل إلى مستودع عدن',
      createdBy: 'خالد أحمد',
      createdAt: '2025-02-10T11:45:00Z'
    },
    {
      id: '5',
      warehouseId: '3',
      warehouseName: 'مستودع تعز',
      itemId: '4',
      itemCode: 'ITEM-004',
      itemName: 'ماوس Logitech',
      movementType: 'ADJUSTMENT',
      quantity: -5,
      unitPrice: 15,
      totalValue: -75,
      referenceType: 'ADJUSTMENT',
      referenceId: 'ADJ-001',
      notes: 'تسوية جرد - عجز',
      createdBy: 'عبدالله محمد',
      createdAt: '2025-03-05T16:30:00Z'
    },
    {
      id: '6',
      warehouseId: '1',
      warehouseName: 'المستودع الرئيسي',
      itemId: '5',
      itemCode: 'ITEM-005',
      itemName: 'لوحة مفاتيح Mechanical',
      movementType: 'IN',
      quantity: 100,
      unitPrice: 50,
      totalValue: 5000,
      referenceType: 'PURCHASE_ORDER',
      referenceId: 'PO-003',
      notes: 'شحنة كبيرة',
      createdBy: 'أحمد محمد',
      createdAt: '2025-03-15T08:00:00Z'
    },
    {
      id: '7',
      warehouseId: '2',
      warehouseName: 'مستودع عدن',
      itemId: '2',
      itemCode: 'ITEM-002',
      itemName: 'شاشة Samsung 27"',
      movementType: 'OUT',
      quantity: 8,
      unitPrice: 250,
      totalValue: 2000,
      referenceType: 'SALES_ORDER',
      referenceId: 'SO-002',
      notes: 'بيع محلي',
      createdBy: 'علي حسن',
      createdAt: '2025-04-01T13:20:00Z'
    },
    {
      id: '8',
      warehouseId: '4',
      warehouseName: 'مستودع الحديدة',
      itemId: '6',
      itemCode: 'ITEM-006',
      itemName: 'سماعات Bluetooth',
      movementType: 'IN',
      quantity: 200,
      unitPrice: 30,
      totalValue: 6000,
      referenceType: 'PURCHASE_ORDER',
      referenceId: 'PO-004',
      notes: 'استيراد من الصين',
      createdBy: 'خالد أحمد',
      createdAt: '2025-04-15T10:00:00Z'
    }
  ];

  /**
   * الحصول على جميع حركات المخزون مع الفلاتر و pagination
   */
  findAll(filters?: StockMovementFilters): StockMovement[] {
    let filtered = this.movements.filter(m => !m.isDeleted);

    if (filters?.warehouseId) {
      filtered = filtered.filter(m => m.warehouseId === filters.warehouseId);
    }

    if (filters?.itemId) {
      filtered = filtered.filter(m => m.itemId === filters.itemId);
    }

    if (filters?.movementType) {
      filtered = filtered.filter(m => m.movementType === filters.movementType);
    }

    if (filters?.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(m => new Date(m.createdAt) >= startDate);
    }

    if (filters?.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(m => new Date(m.createdAt) <= endDate);
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const skip = filters?.skip || 0;
    const take = filters?.take || 10;
    return filtered.slice(skip, skip + take);
  }

  /**
   * الحصول على حركة واحدة بالمعرف
   */
  findOne(id: string): StockMovement {
    const movement = this.movements.find(m => m.id === id && !m.isDeleted);
    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }
    return movement;
  }

  /**
   * الحصول على إحصائيات حركات المخزون الشاملة
   */
  getStatistics(): StockMovementStatistics {
    const activeMovements = this.movements.filter(m => !m.isDeleted);
    
    // الحصول على تاريخ اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // حساب الإحصائيات
    let totalIncoming = 0;
    let totalOutgoing = 0;
    let movementsToday = 0;
    const byMovementType = {
      IN: 0,
      OUT: 0,
      TRANSFER: 0,
      ADJUSTMENT: 0
    };

    activeMovements.forEach(movement => {
      // حساب الوارد والصادر
      if (movement.movementType === 'IN') {
        totalIncoming += movement.quantity;
        byMovementType.IN++;
      } else if (movement.movementType === 'OUT') {
        totalOutgoing += movement.quantity;
        byMovementType.OUT++;
      } else if (movement.movementType === 'TRANSFER') {
        byMovementType.TRANSFER++;
      } else if (movement.movementType === 'ADJUSTMENT') {
        byMovementType.ADJUSTMENT++;
      }

      // حساب حركات اليوم
      const movementDate = new Date(movement.createdAt);
      movementDate.setHours(0, 0, 0, 0);
      if (movementDate.getTime() === today.getTime()) {
        movementsToday++;
      }
    });

    return {
      totalIncoming,
      totalOutgoing,
      movementsToday,
      totalMovements: activeMovements.length,
      byMovementType
    };
  }

  /**
   * الحصول على إحصائيات حسب المستودع
   */
  getWarehouseStatistics(warehouseId: string): any {
    const warehouseMovements = this.movements.filter(
      m => m.warehouseId === warehouseId && !m.isDeleted
    );

    let incoming = 0;
    let outgoing = 0;

    warehouseMovements.forEach(movement => {
      if (movement.movementType === 'IN') {
        incoming += movement.quantity;
      } else if (movement.movementType === 'OUT') {
        outgoing += movement.quantity;
      }
    });

    return {
      warehouseId,
      totalMovements: warehouseMovements.length,
      incoming,
      outgoing,
      balance: incoming - outgoing
    };
  }

  /**
   * الحصول على إحصائيات حسب الصنف
   */
  getItemStatistics(itemId: string): any {
    const itemMovements = this.movements.filter(
      m => m.itemId === itemId && !m.isDeleted
    );

    let incoming = 0;
    let outgoing = 0;
    let totalValue = 0;

    itemMovements.forEach(movement => {
      if (movement.movementType === 'IN') {
        incoming += movement.quantity;
        totalValue += movement.totalValue || 0;
      } else if (movement.movementType === 'OUT') {
        outgoing += movement.quantity;
        totalValue -= movement.totalValue || 0;
      }
    });

    return {
      itemId,
      totalMovements: itemMovements.length,
      incoming,
      outgoing,
      balance: incoming - outgoing,
      totalValue
    };
  }

  /**
   * إنشاء حركة مخزون جديدة
   */
  create(createDto: any): StockMovement {
    const newMovement: StockMovement = {
      id: String(this.movements.length + 1),
      warehouseId: createDto.warehouseId,
      warehouseName: this.getWarehouseName(createDto.warehouseId),
      itemId: createDto.itemId,
      itemCode: this.getItemCode(createDto.itemId),
      itemName: this.getItemName(createDto.itemId),
      movementType: createDto.movementType,
      quantity: createDto.quantity,
      unitPrice: createDto.unitCost || 0,
      totalValue: (createDto.unitCost || 0) * createDto.quantity,
      referenceType: createDto.referenceType,
      referenceId: createDto.referenceId,
      notes: createDto.notes,
      createdBy: 'المستخدم الحالي',
      createdAt: new Date().toISOString()
    };
    this.movements.push(newMovement);
    return newMovement;
  }

  /**
   * تحديث حركة مخزون
   */
  update(id: string, updateDto: any): StockMovement {
    const movement = this.findOne(id);
    Object.assign(movement, updateDto);
    return movement;
  }

  /**
   * حذف حركة مخزون
   */
  remove(id: string): StockMovement {
    const movement = this.findOne(id);
    movement.isDeleted = true;
    return movement;
  }

  /**
   * الحصول على اسم المستودع
   */
  private getWarehouseName(warehouseId: string): string {
    const warehouses: any = {
      '1': 'المستودع الرئيسي',
      '2': 'مستودع عدن',
      '3': 'مستودع تعز',
      '4': 'مستودع الحديدة'
    };
    return warehouses[warehouseId] || 'مستودع جديد';
  }

  /**
   * الحصول على رمز الصنف
   */
  private getItemCode(itemId: string): string {
    return `ITEM-${String(itemId).padStart(3, '0')}`;
  }

  /**
   * الحصول على اسم الصنف
   */
  private getItemName(itemId: string): string {
    const items: any = {
      '1': 'لابتوب Dell Latitude',
      '2': 'شاشة Samsung 27"',
      '3': 'طابعة HP LaserJet',
      '4': 'ماوس Logitech',
      '5': 'لوحة مفاتيح Mechanical',
      '6': 'سماعات Bluetooth'
    };
    return items[itemId] || 'صنف جديد';
  }
}
