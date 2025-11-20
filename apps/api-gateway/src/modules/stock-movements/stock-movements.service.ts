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

  findAll(warehouseId?: string): StockMovement[] {
    let filtered = this.movements.filter(m => !m['isDeleted']);
    if (warehouseId) {
      filtered = filtered.filter(m => m.warehouseId === warehouseId);
    }
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findOne(id: string): StockMovement {
    const movement = this.movements.find(m => m.id === id && !m['isDeleted']);
    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }
    return movement;
  }

  create(createDto: any): StockMovement {
    const newMovement: StockMovement = {
      id: String(this.movements.length + 1),
      warehouseId: createDto.warehouseId,
      warehouseName: 'مستودع جديد',
      itemId: createDto.itemId,
      itemCode: 'ITEM-NEW',
      itemName: 'صنف جديد',
      movementType: createDto.movementType,
      quantity: createDto.quantity,
      unitPrice: 0,
      totalValue: 0,
      referenceType: createDto.referenceType,
      referenceId: createDto.referenceId,
      notes: createDto.notes,
      createdBy: 'المستخدم الحالي',
      createdAt: new Date().toISOString()
    };
    this.movements.push(newMovement);
    return newMovement;
  }

  update(id: string, updateDto: any): StockMovement {
    const movement = this.findOne(id);
    Object.assign(movement, updateDto);
    return movement;
  }

  remove(id: string): StockMovement {
    const movement = this.findOne(id);
    movement['isDeleted'] = true;
    return movement;
  }
}
