import { Injectable, NotFoundException } from '@nestjs/common';

export interface Sector {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  isActive: boolean;
}

export interface GeneFeature {
  id: string;
  featureType: 'UI_FIELD' | 'PAGE' | 'MENU_ITEM' | 'REPORT' | 'VALIDATION' | 'WORKFLOW';
  targetPage?: string;
  featureNameAr: string;
  featureNameEn?: string;
  description?: string;
  isRequired: boolean;
}

export interface Gene {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  category: 'ACCOUNTING' | 'INVENTORY' | 'PURCHASES' | 'SALES' | 'HR' | 'CRM';
  geneType: 'PUBLIC' | 'PRIVATE';
  sectorId?: string;
  sectorName?: string;
  features: GeneFeature[];
  isActive: boolean;
  createdAt: string;
}

export interface GeneActivation {
  id: string;
  geneId: string;
  geneName: string;
  holdingId: string;
  activatedBy: string;
  activatedAt: string;
  config?: any;
  isActive: boolean;
}

@Injectable()
export class GenesService {
  private sectors: Sector[] = [
    {
      id: '1',
      code: 'GENERAL',
      nameAr: 'عام',
      nameEn: 'General',
      icon: '📦',
      isActive: true
    },
    {
      id: '2',
      code: 'SUPERMARKET',
      nameAr: 'سوبر ماركت',
      nameEn: 'Supermarket',
      icon: '🏪',
      isActive: true
    },
    {
      id: '3',
      code: 'PHARMACY',
      nameAr: 'صيدلية',
      nameEn: 'Pharmacy',
      icon: '💊',
      isActive: true
    },
    {
      id: '4',
      code: 'RESTAURANT',
      nameAr: 'مطعم',
      nameEn: 'Restaurant',
      icon: '🍔',
      isActive: true
    },
    {
      id: '5',
      code: 'HOSPITAL',
      nameAr: 'مستشفى',
      nameEn: 'Hospital',
      icon: '🏥',
      isActive: true
    }
  ];

  private genes: Gene[] = [
    // ==================== ACCOUNTING GENES ====================
    // Public Accounting Genes
    {
      id: '1',
      code: 'CASH_MANAGEMENT',
      nameAr: 'حركة الصناديق',
      nameEn: 'Cash Management',
      description: 'إدارة الصناديق وحركات النقد',
      category: 'ACCOUNTING',
      geneType: 'PUBLIC',
      features: [
        {
          id: '1-1',
          featureType: 'PAGE',
          featureNameAr: 'صفحة إدارة الصناديق',
          featureNameEn: 'Cash Management Page',
          isRequired: true
        },
        {
          id: '1-2',
          featureType: 'MENU_ITEM',
          featureNameAr: 'قائمة الصناديق',
          featureNameEn: 'Cash Menu',
          isRequired: true
        },
        {
          id: '1-3',
          featureType: 'REPORT',
          featureNameAr: 'تقارير الصناديق',
          featureNameEn: 'Cash Reports',
          isRequired: false
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      code: 'CHECK_MANAGEMENT',
      nameAr: 'إدارة الشيكات',
      nameEn: 'Check Management',
      description: 'إدارة الشيكات الصادرة والواردة',
      category: 'ACCOUNTING',
      geneType: 'PUBLIC',
      features: [
        {
          id: '2-1',
          featureType: 'PAGE',
          featureNameAr: 'صفحة الشيكات',
          isRequired: true
        },
        {
          id: '2-2',
          featureType: 'UI_FIELD',
          targetPage: 'payments',
          featureNameAr: 'حقول الشيك (رقم، تاريخ، بنك)',
          isRequired: true
        },
        {
          id: '2-3',
          featureType: 'VALIDATION',
          featureNameAr: 'التحقق من حالة الشيك',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '3',
      code: 'POPULAR_ACCOUNT_NAMES',
      nameAr: 'المسميات الشعبية للحسابات',
      nameEn: 'Popular Account Names',
      description: 'إضافة مسميات شعبية للحسابات المحاسبية',
      category: 'ACCOUNTING',
      geneType: 'PUBLIC',
      features: [
        {
          id: '3-1',
          featureType: 'UI_FIELD',
          targetPage: 'accounts',
          featureNameAr: 'حقل المسمى الشعبي',
          isRequired: true
        },
        {
          id: '3-2',
          featureType: 'UI_FIELD',
          targetPage: 'accounts',
          featureNameAr: 'البحث بالمسمى الشعبي',
          isRequired: false
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '4',
      code: 'VAULT_MANAGEMENT',
      nameAr: 'إدارة الخزائن',
      nameEn: 'Vault Management',
      description: 'إدارة الخزائن والأموال المحفوظة',
      category: 'ACCOUNTING',
      geneType: 'PUBLIC',
      features: [
        {
          id: '4-1',
          featureType: 'PAGE',
          featureNameAr: 'صفحة الخزائن',
          isRequired: true
        },
        {
          id: '4-2',
          featureType: 'REPORT',
          featureNameAr: 'تقارير الخزائن',
          isRequired: false
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },

    // Private Accounting Genes - Pharmacy
    {
      id: '5',
      code: 'PHARMACY_MOH_REPORTS',
      nameAr: 'تقارير وزارة الصحة',
      nameEn: 'Ministry of Health Reports',
      description: 'تقارير محاسبية خاصة بوزارة الصحة',
      category: 'ACCOUNTING',
      geneType: 'PRIVATE',
      sectorId: '3',
      sectorName: 'صيدلية',
      features: [
        {
          id: '5-1',
          featureType: 'REPORT',
          featureNameAr: 'تقرير المبيعات الدوائية الشهري',
          isRequired: true
        },
        {
          id: '5-2',
          featureType: 'REPORT',
          featureNameAr: 'تقرير الأدوية المخدرة',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '6',
      code: 'MEDICAL_BILLING',
      nameAr: 'الفوترة الطبية',
      nameEn: 'Medical Billing',
      description: 'نظام فوترة خاص بالصيدليات',
      category: 'ACCOUNTING',
      geneType: 'PRIVATE',
      sectorId: '3',
      sectorName: 'صيدلية',
      features: [
        {
          id: '6-1',
          featureType: 'UI_FIELD',
          targetPage: 'invoices',
          featureNameAr: 'حقول التأمين الطبي',
          isRequired: true
        },
        {
          id: '6-2',
          featureType: 'VALIDATION',
          featureNameAr: 'التحقق من بطاقة التأمين',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },

    // ==================== INVENTORY GENES ====================
    // Public Inventory Genes
    {
      id: '7',
      code: 'BASIC_BARCODE',
      nameAr: 'الباركود الأساسي',
      nameEn: 'Basic Barcode',
      description: 'نظام باركود أساسي للأصناف',
      category: 'INVENTORY',
      geneType: 'PUBLIC',
      features: [
        {
          id: '7-1',
          featureType: 'UI_FIELD',
          targetPage: 'items',
          featureNameAr: 'حقل الباركود',
          isRequired: true
        },
        {
          id: '7-2',
          featureType: 'PAGE',
          featureNameAr: 'طباعة الباركود',
          isRequired: false
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '8',
      code: 'PERIODIC_INVENTORY',
      nameAr: 'الجرد الدوري',
      nameEn: 'Periodic Inventory',
      description: 'نظام جرد دوري متقدم',
      category: 'INVENTORY',
      geneType: 'PUBLIC',
      features: [
        {
          id: '8-1',
          featureType: 'PAGE',
          featureNameAr: 'صفحة الجرد الدوري',
          isRequired: true
        },
        {
          id: '8-2',
          featureType: 'WORKFLOW',
          featureNameAr: 'سير عمل الجرد',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '9',
      code: 'REORDER_POINT',
      nameAr: 'حد إعادة الطلب',
      nameEn: 'Reorder Point',
      description: 'تنبيهات تلقائية عند الوصول لحد إعادة الطلب',
      category: 'INVENTORY',
      geneType: 'PUBLIC',
      features: [
        {
          id: '9-1',
          featureType: 'UI_FIELD',
          targetPage: 'items',
          featureNameAr: 'حقل حد إعادة الطلب',
          isRequired: true
        },
        {
          id: '9-2',
          featureType: 'VALIDATION',
          featureNameAr: 'تنبيه عند الوصول للحد',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },

    // Private Inventory Genes - Pharmacy
    {
      id: '10',
      code: 'EXPIRY_DATE_MANAGEMENT',
      nameAr: 'إدارة تواريخ الصلاحية',
      nameEn: 'Expiry Date Management',
      description: 'نظام إلزامي لتتبع تواريخ صلاحية الأدوية',
      category: 'INVENTORY',
      geneType: 'PRIVATE',
      sectorId: '3',
      sectorName: 'صيدلية',
      features: [
        {
          id: '10-1',
          featureType: 'UI_FIELD',
          targetPage: 'items',
          featureNameAr: 'حقول تاريخ الإنتاج والصلاحية (إلزامي)',
          isRequired: true
        },
        {
          id: '10-2',
          featureType: 'VALIDATION',
          featureNameAr: 'منع البيع للأصناف منتهية الصلاحية',
          isRequired: true
        },
        {
          id: '10-3',
          featureType: 'REPORT',
          featureNameAr: 'تقرير الأصناف قريبة الصلاحية',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '11',
      code: 'DRUG_CLASSIFICATION',
      nameAr: 'التصنيف الدوائي',
      nameEn: 'Drug Classification',
      description: 'تصنيف الأدوية حسب النوع والمجموعة الدوائية',
      category: 'INVENTORY',
      geneType: 'PRIVATE',
      sectorId: '3',
      sectorName: 'صيدلية',
      features: [
        {
          id: '11-1',
          featureType: 'UI_FIELD',
          targetPage: 'items',
          featureNameAr: 'حقول التصنيف الدوائي',
          isRequired: true
        },
        {
          id: '11-2',
          featureType: 'PAGE',
          featureNameAr: 'صفحة إدارة التصنيفات الدوائية',
          isRequired: false
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '12',
      code: 'PRESCRIPTION_MANAGEMENT',
      nameAr: 'إدارة الوصفات الطبية',
      nameEn: 'Prescription Management',
      description: 'نظام إدارة الوصفات الطبية',
      category: 'INVENTORY',
      geneType: 'PRIVATE',
      sectorId: '3',
      sectorName: 'صيدلية',
      features: [
        {
          id: '12-1',
          featureType: 'PAGE',
          featureNameAr: 'صفحة الوصفات الطبية',
          isRequired: true
        },
        {
          id: '12-2',
          featureType: 'VALIDATION',
          featureNameAr: 'التحقق من الوصفة قبل الصرف',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '13',
      code: 'DRUG_INTERACTION_ALERTS',
      nameAr: 'تنبيهات التفاعلات الدوائية',
      nameEn: 'Drug Interaction Alerts',
      description: 'تنبيهات عند وجود تفاعلات دوائية خطرة',
      category: 'INVENTORY',
      geneType: 'PRIVATE',
      sectorId: '3',
      sectorName: 'صيدلية',
      features: [
        {
          id: '13-1',
          featureType: 'VALIDATION',
          featureNameAr: 'التحقق من التفاعلات الدوائية',
          isRequired: true
        },
        {
          id: '13-2',
          featureType: 'REPORT',
          featureNameAr: 'تقرير التفاعلات الدوائية',
          isRequired: false
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '14',
      code: 'CONTROLLED_DRUGS',
      nameAr: 'إدارة الأدوية المخدرة',
      nameEn: 'Controlled Drugs Management',
      description: 'نظام خاص لإدارة الأدوية المخدرة والمراقبة',
      category: 'INVENTORY',
      geneType: 'PRIVATE',
      sectorId: '3',
      sectorName: 'صيدلية',
      features: [
        {
          id: '14-1',
          featureType: 'UI_FIELD',
          targetPage: 'items',
          featureNameAr: 'علامة دواء مخدر',
          isRequired: true
        },
        {
          id: '14-2',
          featureType: 'VALIDATION',
          featureNameAr: 'قيود صارمة على الصرف',
          isRequired: true
        },
        {
          id: '14-3',
          featureType: 'REPORT',
          featureNameAr: 'تقرير الأدوية المخدرة',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },

    // Private Inventory Genes - Supermarket
    {
      id: '15',
      code: 'SHELF_AISLE_MANAGEMENT',
      nameAr: 'إدارة الأرفف والممرات',
      nameEn: 'Shelf & Aisle Management',
      description: 'نظام إدارة الأرفف والممرات في السوبر ماركت',
      category: 'INVENTORY',
      geneType: 'PRIVATE',
      sectorId: '2',
      sectorName: 'سوبر ماركت',
      features: [
        {
          id: '15-1',
          featureType: 'UI_FIELD',
          targetPage: 'items',
          featureNameAr: 'حقول رقم الرف والممر',
          isRequired: true
        },
        {
          id: '15-2',
          featureType: 'PAGE',
          featureNameAr: 'خريطة المستودع',
          isRequired: false
        },
        {
          id: '15-3',
          featureType: 'REPORT',
          featureNameAr: 'تقرير الأصناف حسب الرف',
          isRequired: false
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '16',
      code: 'WEIGHT_SYSTEM',
      nameAr: 'نظام الوزن',
      nameEn: 'Weight System',
      description: 'نظام وزن للخضار والفواكه',
      category: 'INVENTORY',
      geneType: 'PRIVATE',
      sectorId: '2',
      sectorName: 'سوبر ماركت',
      features: [
        {
          id: '16-1',
          featureType: 'UI_FIELD',
          targetPage: 'items',
          featureNameAr: 'علامة صنف بالوزن',
          isRequired: true
        },
        {
          id: '16-2',
          featureType: 'VALIDATION',
          featureNameAr: 'حساب السعر حسب الوزن',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },

    // ==================== SALES GENES ====================
    // Public Sales Genes
    {
      id: '17',
      code: 'LOYALTY_POINTS',
      nameAr: 'نظام النقاط',
      nameEn: 'Loyalty Points',
      description: 'نظام نقاط الولاء للعملاء',
      category: 'SALES',
      geneType: 'PUBLIC',
      features: [
        {
          id: '17-1',
          featureType: 'UI_FIELD',
          targetPage: 'customers',
          featureNameAr: 'حقل النقاط',
          isRequired: true
        },
        {
          id: '17-2',
          featureType: 'PAGE',
          featureNameAr: 'صفحة إدارة النقاط',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '18',
      code: 'ADVANCED_DISCOUNTS',
      nameAr: 'الخصومات المتقدمة',
      nameEn: 'Advanced Discounts',
      description: 'نظام خصومات متقدم (نسبة، مبلغ، شرطي)',
      category: 'SALES',
      geneType: 'PUBLIC',
      features: [
        {
          id: '18-1',
          featureType: 'UI_FIELD',
          targetPage: 'invoices',
          featureNameAr: 'أنواع خصومات متعددة',
          isRequired: true
        },
        {
          id: '18-2',
          featureType: 'VALIDATION',
          featureNameAr: 'قواعد الخصومات',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },

    // Private Sales Genes - Pharmacy
    {
      id: '19',
      code: 'MEDICAL_INSURANCE',
      nameAr: 'نظام التأمين الطبي',
      nameEn: 'Medical Insurance System',
      description: 'نظام التأمين الطبي للصيدليات',
      category: 'SALES',
      geneType: 'PRIVATE',
      sectorId: '3',
      sectorName: 'صيدلية',
      features: [
        {
          id: '19-1',
          featureType: 'UI_FIELD',
          targetPage: 'invoices',
          featureNameAr: 'حقول التأمين',
          isRequired: true
        },
        {
          id: '19-2',
          featureType: 'VALIDATION',
          featureNameAr: 'التحقق من التغطية التأمينية',
          isRequired: true
        },
        {
          id: '19-3',
          featureType: 'REPORT',
          featureNameAr: 'تقرير مطالبات التأمين',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },

    // Private Sales Genes - Supermarket
    {
      id: '20',
      code: 'PROMOTIONAL_OFFERS',
      nameAr: 'العروض الترويجية',
      nameEn: 'Promotional Offers',
      description: 'نظام عروض (2+1، اشتري واحصل على الثاني)',
      category: 'SALES',
      geneType: 'PRIVATE',
      sectorId: '2',
      sectorName: 'سوبر ماركت',
      features: [
        {
          id: '20-1',
          featureType: 'PAGE',
          featureNameAr: 'صفحة إدارة العروض',
          isRequired: true
        },
        {
          id: '20-2',
          featureType: 'VALIDATION',
          featureNameAr: 'تطبيق العروض تلقائياً',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '21',
      code: 'QUICK_POS',
      nameAr: 'نقاط البيع السريعة',
      nameEn: 'Quick POS',
      description: 'نظام نقاط بيع سريع للسوبر ماركت',
      category: 'SALES',
      geneType: 'PRIVATE',
      sectorId: '2',
      sectorName: 'سوبر ماركت',
      features: [
        {
          id: '21-1',
          featureType: 'PAGE',
          featureNameAr: 'واجهة POS سريعة',
          isRequired: true
        },
        {
          id: '21-2',
          featureType: 'UI_FIELD',
          featureNameAr: 'مسح باركود سريع',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: '22',
      code: 'CASHIER_SHIFTS',
      nameAr: 'إدارة الكاشير والورديات',
      nameEn: 'Cashier & Shifts Management',
      description: 'نظام إدارة الكاشير والورديات',
      category: 'SALES',
      geneType: 'PRIVATE',
      sectorId: '2',
      sectorName: 'سوبر ماركت',
      features: [
        {
          id: '22-1',
          featureType: 'PAGE',
          featureNameAr: 'صفحة الورديات',
          isRequired: true
        },
        {
          id: '22-2',
          featureType: 'REPORT',
          featureNameAr: 'تقرير مبيعات الكاشير',
          isRequired: true
        }
      ],
      isActive: true,
      createdAt: '2025-01-01'
    }
  ];

  private activations: GeneActivation[] = [];

  getAllSectors(): Sector[] {
    return this.sectors.filter(s => s.isActive);
  }

  findAll(category?: string, geneType?: string): Gene[] {
    let filtered = this.genes.filter(g => g.isActive);
    
    if (category) {
      filtered = filtered.filter(g => g.category === category);
    }
    
    if (geneType) {
      filtered = filtered.filter(g => g.geneType === geneType);
    }
    
    return filtered;
  }

  getAvailableGenes(holdingId: string): Gene[] {
    // في الإنتاج، نجلب قطاع العميل من قاعدة البيانات
    // هنا نفترض أن العميل من قطاع الصيدليات للتجربة
    const holdingSectorId = '3'; // Pharmacy
    
    return this.genes.filter(g => 
      g.isActive && (
        g.geneType === 'PUBLIC' || 
        g.sectorId === holdingSectorId
      )
    );
  }

  getActiveGenes(holdingId: string): GeneActivation[] {
    return this.activations.filter(a => 
      a.holdingId === holdingId && a.isActive
    );
  }

  findOne(id: string): Gene {
    const gene = this.genes.find(g => g.id === id && g.isActive);
    if (!gene) {
      throw new NotFoundException(`Gene with ID ${id} not found`);
    }
    return gene;
  }

  create(createDto: any): Gene {
    const newGene: Gene = {
      id: String(this.genes.length + 1),
      code: createDto.code,
      nameAr: createDto.nameAr,
      nameEn: createDto.nameEn,
      description: createDto.description,
      category: createDto.category,
      geneType: createDto.geneType,
      sectorId: createDto.sectorId,
      features: createDto.features || [],
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    if (newGene.sectorId) {
      const sector = this.sectors.find(s => s.id === newGene.sectorId);
      if (sector) {
        newGene.sectorName = sector.nameAr;
      }
    }
    
    this.genes.push(newGene);
    return newGene;
  }

  activate(geneId: string, activateDto: any): GeneActivation {
    const gene = this.findOne(geneId);
    
    // Check if already activated
    const existing = this.activations.find(a => 
      a.geneId === geneId && 
      a.holdingId === activateDto.holdingId && 
      a.isActive
    );
    
    if (existing) {
      return existing;
    }
    
    const activation: GeneActivation = {
      id: String(this.activations.length + 1),
      geneId: geneId,
      geneName: gene.nameAr,
      holdingId: activateDto.holdingId,
      activatedBy: 'admin',
      activatedAt: new Date().toISOString(),
      config: activateDto.config,
      isActive: true
    };
    
    this.activations.push(activation);
    return activation;
  }

  deactivate(geneId: string, holdingId: string): GeneActivation {
    const activation = this.activations.find(a => 
      a.geneId === geneId && 
      a.holdingId === holdingId && 
      a.isActive
    );
    
    if (!activation) {
      throw new NotFoundException('Activation not found');
    }
    
    activation.isActive = false;
    return activation;
  }

  update(id: string, updateDto: any): Gene {
    const gene = this.findOne(id);
    Object.assign(gene, updateDto);
    return gene;
  }

  remove(id: string): Gene {
    const gene = this.findOne(id);
    gene.isActive = false;
    return gene;
  }
}
