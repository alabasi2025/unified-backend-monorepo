# SEMOP - تصميم قاعدة البيانات للأنظمة المحاسبية المتقدمة

**الإصدار:** v0.4.0  
**التاريخ:** 2025-11-20  
**المطور الرئيسي:** SEMOP Team

---

## 📋 نظرة عامة

هذا المستند يحدد تصميم قاعدة البيانات الكامل للأنظمة المحاسبية المتقدمة:

1. **نظام الموردين** (Suppliers)
2. **نظام العملاء** (Customers)
3. **نظام المخزون** (Inventory)
4. **نظام المشتريات** (Purchases)
5. **نظام المبيعات** (Sales)

---

## 🏗️ 1. نظام الموردين (Suppliers)

### الجداول (4 جداول)

#### 1.1 Supplier Categories (فئات الموردين)
```typescript
SupplierCategory {
  id: UUID (PK)
  code: String (Unique, Index)
  nameAr: String
  nameEn: String
  description?: String
  isActive: Boolean (Default: true, Index)
  
  // Relations
  suppliers: Supplier[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
}
```

#### 1.2 Suppliers (الموردين)
```typescript
Supplier {
  id: UUID (PK)
  code: String (Unique, Index)
  nameAr: String
  nameEn: String
  taxNumber?: String (Unique, Index)
  commercialRegister?: String
  email?: String (Index)
  phone?: String
  website?: String
  paymentTerms?: Int (Default: 30) // أيام الدفع
  creditLimit?: Decimal(15,2)
  currentBalance: Decimal(15,2) (Default: 0) // الرصيد الحالي
  isActive: Boolean (Default: true, Index)
  
  // Relations
  categoryId?: UUID (FK → SupplierCategory)
  category?: SupplierCategory
  
  // Multi-Entity Support
  holdingId?: UUID
  unitId?: UUID
  
  // Relations
  addresses: SupplierAddress[]
  contacts: SupplierContact[]
  purchaseOrders: PurchaseOrder[]
  purchaseInvoices: PurchaseInvoice[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
}
```

**الفهارس:**
- code (Unique)
- taxNumber (Unique)
- email
- categoryId
- holdingId, unitId
- isActive

**القيود:**
- code: Regex `^SUP-[0-9]{6}$`
- taxNumber: Regex `^[0-9]{15}$` (للسعودية)
- email: Email validation
- paymentTerms: Min 0, Max 365
- creditLimit: Min 0

---

#### 1.3 Supplier Addresses (عناوين الموردين)
```typescript
SupplierAddress {
  id: UUID (PK)
  supplierId: UUID (FK → Supplier, Cascade)
  addressType: AddressType (Enum: BILLING, SHIPPING, BOTH)
  country: String
  city: String
  district?: String
  street?: String
  buildingNumber?: String
  postalCode?: String
  isPrimary: Boolean (Default: false)
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
}
```

**الفهارس:**
- supplierId
- addressType
- isPrimary

**القيود:**
- واحد فقط isPrimary = true لكل supplierId

---

#### 1.4 Supplier Contacts (جهات اتصال الموردين)
```typescript
SupplierContact {
  id: UUID (PK)
  supplierId: UUID (FK → Supplier, Cascade)
  name: String
  position?: String
  email?: String
  phone?: String
  mobile?: String
  isPrimary: Boolean (Default: false)
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
}
```

**الفهارس:**
- supplierId
- isPrimary

**القيود:**
- واحد فقط isPrimary = true لكل supplierId

---

## 👥 2. نظام العملاء (Customers)

### الجداول (4 جداول)

#### 2.1 Customer Categories (فئات العملاء)
```typescript
CustomerCategory {
  id: UUID (PK)
  code: String (Unique, Index)
  nameAr: String
  nameEn: String
  description?: String
  discountPercentage?: Decimal(5,2) (Default: 0) // نسبة خصم افتراضية
  isActive: Boolean (Default: true, Index)
  
  // Relations
  customers: Customer[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
}
```

#### 2.2 Customers (العملاء)
```typescript
Customer {
  id: UUID (PK)
  code: String (Unique, Index)
  nameAr: String
  nameEn: String
  taxNumber?: String (Unique, Index)
  commercialRegister?: String
  email?: String (Index)
  phone?: String
  website?: String
  paymentTerms?: Int (Default: 30)
  creditLimit?: Decimal(15,2)
  currentBalance: Decimal(15,2) (Default: 0)
  isActive: Boolean (Default: true, Index)
  
  // Relations
  categoryId?: UUID (FK → CustomerCategory)
  category?: CustomerCategory
  
  // Multi-Entity Support
  holdingId?: UUID
  unitId?: UUID
  
  // Relations
  addresses: CustomerAddress[]
  contacts: CustomerContact[]
  salesOrders: SalesOrder[]
  salesInvoices: SalesInvoice[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
}
```

**الفهارس:** (مثل Supplier)

#### 2.3 Customer Addresses
```typescript
CustomerAddress {
  // نفس هيكل SupplierAddress
}
```

#### 2.4 Customer Contacts
```typescript
CustomerContact {
  // نفس هيكل SupplierContact
}
```

---

## 📦 3. نظام المخزون (Inventory)

### الجداول (6 جداول)

#### 3.1 Item Categories (فئات الأصناف)
```typescript
ItemCategory {
  id: UUID (PK)
  code: String (Unique, Index)
  nameAr: String
  nameEn: String
  description?: String
  isActive: Boolean (Default: true, Index)
  
  // Self-Referencing (Hierarchical)
  parentId?: UUID (FK → ItemCategory, SetNull)
  parent?: ItemCategory
  children: ItemCategory[]
  
  // Relations
  items: Item[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
}
```

#### 3.2 Items (الأصناف)
```typescript
Item {
  id: UUID (PK)
  code: String (Unique, Index)
  barcode?: String (Unique, Index)
  nameAr: String
  nameEn: String
  description?: String
  itemType: ItemType (Enum: PRODUCT, SERVICE, MATERIAL)
  unit: String // وحدة القياس (قطعة، كيلو، متر، إلخ)
  
  // Pricing
  costPrice: Decimal(15,2) (Default: 0) // سعر التكلفة
  sellingPrice: Decimal(15,2) (Default: 0) // سعر البيع
  minSellingPrice?: Decimal(15,2) // الحد الأدنى لسعر البيع
  
  // Stock
  reorderLevel?: Decimal(10,2) // مستوى إعادة الطلب
  maxStockLevel?: Decimal(10,2) // الحد الأقصى للمخزون
  
  // Flags
  isActive: Boolean (Default: true, Index)
  isSellable: Boolean (Default: true)
  isPurchasable: Boolean (Default: true)
  isStockable: Boolean (Default: true) // هل يتم تتبعه في المخزون
  
  // Relations
  categoryId?: UUID (FK → ItemCategory)
  category?: ItemCategory
  
  // Accounting Integration
  salesAccountId?: UUID (FK → Account) // حساب المبيعات
  purchaseAccountId?: UUID (FK → Account) // حساب المشتريات
  inventoryAccountId?: UUID (FK → Account) // حساب المخزون
  
  // Multi-Entity Support
  holdingId?: UUID
  
  // Relations
  stockLevels: StockLevel[]
  stockMovements: StockMovement[]
  purchaseOrderLines: PurchaseOrderLine[]
  purchaseInvoiceLines: PurchaseInvoiceLine[]
  salesOrderLines: SalesOrderLine[]
  salesInvoiceLines: SalesInvoiceLine[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
}
```

**الفهارس:**
- code (Unique)
- barcode (Unique)
- itemType
- categoryId
- isActive, isSellable, isPurchasable, isStockable

**القيود:**
- code: Regex `^ITEM-[0-9]{6}$`
- barcode: Regex `^[0-9]{8,13}$` (EAN-8 or EAN-13)
- costPrice, sellingPrice, minSellingPrice: Min 0
- sellingPrice >= minSellingPrice
- reorderLevel, maxStockLevel: Min 0

---

#### 3.3 Warehouses (المخازن)
```typescript
Warehouse {
  id: UUID (PK)
  code: String (Unique, Index)
  nameAr: String
  nameEn: String
  description?: String
  location?: String
  isActive: Boolean (Default: true, Index)
  
  // Multi-Entity Support
  holdingId?: UUID
  unitId?: UUID
  
  // Relations
  stockLevels: StockLevel[]
  stockMovements: StockMovement[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
}
```

#### 3.4 Stock Levels (مستويات المخزون)
```typescript
StockLevel {
  id: UUID (PK)
  
  itemId: UUID (FK → Item, Cascade)
  item: Item
  
  warehouseId: UUID (FK → Warehouse, Cascade)
  warehouse: Warehouse
  
  quantity: Decimal(10,2) (Default: 0)
  reservedQuantity: Decimal(10,2) (Default: 0) // الكمية المحجوزة
  availableQuantity: Decimal(10,2) (Default: 0) // Computed: quantity - reservedQuantity
  
  // Audit Trail
  updatedAt: DateTime
}
```

**الفهارس:**
- itemId
- warehouseId
- (itemId, warehouseId) Unique

**القيود:**
- quantity, reservedQuantity: Min 0
- reservedQuantity <= quantity

---

#### 3.5 Stock Movements (حركات المخزون)
```typescript
StockMovement {
  id: UUID (PK)
  movementNumber: String (Unique, Index) // SM-YYYY-XXXXXX
  movementDate: DateTime (Index)
  movementType: StockMovementType (Enum, Index)
  
  itemId: UUID (FK → Item, Restrict)
  item: Item
  
  warehouseId: UUID (FK → Warehouse, Restrict)
  warehouse: Warehouse
  
  quantity: Decimal(10,2) // موجب للإضافة، سالب للخصم
  unitCost?: Decimal(15,2) // تكلفة الوحدة
  totalCost?: Decimal(15,2) // Computed: quantity * unitCost
  
  reference?: String // مرجع خارجي (رقم فاتورة، إلخ)
  notes?: String
  
  // Relations (اختياري حسب نوع الحركة)
  purchaseInvoiceLineId?: UUID
  salesInvoiceLineId?: UUID
  
  // Audit Trail
  createdAt: DateTime
  createdBy?: String
}
```

**Enums:**
```typescript
enum StockMovementType {
  PURCHASE_RECEIPT      // استلام شراء
  SALES_ISSUE           // صرف مبيعات
  TRANSFER_IN           // تحويل وارد
  TRANSFER_OUT          // تحويل صادر
  ADJUSTMENT_IN         // تسوية إضافة
  ADJUSTMENT_OUT        // تسوية خصم
  OPENING_BALANCE       // رصيد افتتاحي
  RETURN_FROM_CUSTOMER  // مرتجع من عميل
  RETURN_TO_SUPPLIER    // مرتجع لمورد
}
```

**الفهارس:**
- movementNumber (Unique)
- movementDate
- movementType
- itemId
- warehouseId

---

#### 3.6 Stock Counts (الجرد)
```typescript
StockCount {
  id: UUID (PK)
  countNumber: String (Unique, Index) // SC-YYYY-XXXXXX
  countDate: DateTime (Index)
  status: StockCountStatus (Enum: DRAFT, IN_PROGRESS, COMPLETED, CANCELLED)
  
  warehouseId: UUID (FK → Warehouse, Restrict)
  warehouse: Warehouse
  
  notes?: String
  
  // Relations
  lines: StockCountLine[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
  completedAt?: DateTime
  completedBy?: String
}
```

#### 3.7 Stock Count Lines (سطور الجرد)
```typescript
StockCountLine {
  id: UUID (PK)
  
  stockCountId: UUID (FK → StockCount, Cascade)
  stockCount: StockCount
  
  itemId: UUID (FK → Item, Restrict)
  item: Item
  
  systemQuantity: Decimal(10,2) // الكمية في النظام
  countedQuantity: Decimal(10,2) // الكمية المجردة
  difference: Decimal(10,2) // Computed: countedQuantity - systemQuantity
  
  notes?: String
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## 🛒 4. نظام المشتريات (Purchases)

### الجداول (6 جداول)

#### 4.1 Purchase Orders (طلبات الشراء)
```typescript
PurchaseOrder {
  id: UUID (PK)
  orderNumber: String (Unique, Index) // PO-YYYY-XXXXXX
  orderDate: DateTime (Index)
  expectedDeliveryDate?: DateTime
  status: PurchaseOrderStatus (Enum, Index)
  
  supplierId: UUID (FK → Supplier, Restrict)
  supplier: Supplier
  
  subtotal: Decimal(15,2) (Default: 0)
  taxAmount: Decimal(15,2) (Default: 0)
  discountAmount: Decimal(15,2) (Default: 0)
  totalAmount: Decimal(15,2) (Default: 0)
  
  notes?: String
  
  // Multi-Entity Support
  holdingId?: UUID
  unitId?: UUID
  projectId?: UUID
  
  // Relations
  lines: PurchaseOrderLine[]
  invoices: PurchaseInvoice[] // الفواتير المرتبطة
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
  approvedAt?: DateTime
  approvedBy?: String
}
```

**Enums:**
```typescript
enum PurchaseOrderStatus {
  DRAFT           // مسودة
  PENDING         // قيد الانتظار
  APPROVED        // معتمد
  PARTIALLY_RECEIVED  // مستلم جزئياً
  RECEIVED        // مستلم
  CANCELLED       // ملغي
}
```

#### 4.2 Purchase Order Lines (سطور طلبات الشراء)
```typescript
PurchaseOrderLine {
  id: UUID (PK)
  
  purchaseOrderId: UUID (FK → PurchaseOrder, Cascade)
  purchaseOrder: PurchaseOrder
  
  lineNumber: Int
  
  itemId: UUID (FK → Item, Restrict)
  item: Item
  
  description?: String
  quantity: Decimal(10,2)
  unitPrice: Decimal(15,2)
  taxRate: Decimal(5,2) (Default: 15) // نسبة الضريبة
  discountRate: Decimal(5,2) (Default: 0)
  
  // Computed Fields
  lineTotal: Decimal(15,2) // quantity * unitPrice
  taxAmount: Decimal(15,2) // lineTotal * (taxRate / 100)
  discountAmount: Decimal(15,2) // lineTotal * (discountRate / 100)
  netAmount: Decimal(15,2) // lineTotal + taxAmount - discountAmount
  
  receivedQuantity: Decimal(10,2) (Default: 0) // الكمية المستلمة
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
}
```

**الفهارس:**
- purchaseOrderId
- itemId
- (purchaseOrderId, lineNumber) Unique

---

#### 4.3 Purchase Invoices (فواتير الشراء)
```typescript
PurchaseInvoice {
  id: UUID (PK)
  invoiceNumber: String (Unique, Index) // PI-YYYY-XXXXXX
  supplierInvoiceNumber?: String // رقم فاتورة المورد
  invoiceDate: DateTime (Index)
  dueDate?: DateTime
  status: PurchaseInvoiceStatus (Enum, Index)
  
  supplierId: UUID (FK → Supplier, Restrict)
  supplier: Supplier
  
  purchaseOrderId?: UUID (FK → PurchaseOrder, SetNull)
  purchaseOrder?: PurchaseOrder
  
  subtotal: Decimal(15,2) (Default: 0)
  taxAmount: Decimal(15,2) (Default: 0)
  discountAmount: Decimal(15,2) (Default: 0)
  totalAmount: Decimal(15,2) (Default: 0)
  paidAmount: Decimal(15,2) (Default: 0)
  remainingAmount: Decimal(15,2) (Default: 0) // Computed
  
  notes?: String
  
  // Multi-Entity Support
  holdingId?: UUID
  unitId?: UUID
  projectId?: UUID
  
  // Accounting Integration
  journalEntryId?: UUID (FK → JournalEntry, SetNull)
  
  // Relations
  lines: PurchaseInvoiceLine[]
  returns: PurchaseReturn[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
  postedAt?: DateTime
  postedBy?: String
}
```

**Enums:**
```typescript
enum PurchaseInvoiceStatus {
  DRAFT           // مسودة
  POSTED          // مرحّل
  PARTIALLY_PAID  // مدفوع جزئياً
  PAID            // مدفوع
  CANCELLED       // ملغي
}
```

#### 4.4 Purchase Invoice Lines
```typescript
PurchaseInvoiceLine {
  // نفس هيكل PurchaseOrderLine تقريباً
  // + warehouseId للتحديد أي مخزن
}
```

#### 4.5 Purchase Returns (مرتجعات الشراء)
```typescript
PurchaseReturn {
  id: UUID (PK)
  returnNumber: String (Unique, Index) // PR-YYYY-XXXXXX
  returnDate: DateTime (Index)
  status: PurchaseReturnStatus (Enum)
  
  supplierId: UUID (FK → Supplier, Restrict)
  supplier: Supplier
  
  purchaseInvoiceId: UUID (FK → PurchaseInvoice, Restrict)
  purchaseInvoice: PurchaseInvoice
  
  totalAmount: Decimal(15,2) (Default: 0)
  
  reason?: String
  notes?: String
  
  // Multi-Entity Support
  holdingId?: UUID
  unitId?: UUID
  
  // Accounting Integration
  journalEntryId?: UUID (FK → JournalEntry, SetNull)
  
  // Relations
  lines: PurchaseReturnLine[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
}
```

#### 4.6 Purchase Return Lines
```typescript
PurchaseReturnLine {
  // مشابه لـ PurchaseInvoiceLine
}
```

---

## 💰 5. نظام المبيعات (Sales)

### الجداول (6 جداول)

#### 5.1 Sales Orders (طلبات المبيعات / عروض الأسعار)
```typescript
SalesOrder {
  id: UUID (PK)
  orderNumber: String (Unique, Index) // SO-YYYY-XXXXXX
  orderDate: DateTime (Index)
  expectedDeliveryDate?: DateTime
  status: SalesOrderStatus (Enum, Index)
  
  customerId: UUID (FK → Customer, Restrict)
  customer: Customer
  
  subtotal: Decimal(15,2) (Default: 0)
  taxAmount: Decimal(15,2) (Default: 0)
  discountAmount: Decimal(15,2) (Default: 0)
  totalAmount: Decimal(15,2) (Default: 0)
  
  notes?: String
  
  // Multi-Entity Support
  holdingId?: UUID
  unitId?: UUID
  projectId?: UUID
  
  // Relations
  lines: SalesOrderLine[]
  invoices: SalesInvoice[]
  
  // Audit Trail
  createdAt: DateTime
  updatedAt: DateTime
  createdBy?: String
  updatedBy?: String
  approvedAt?: DateTime
  approvedBy?: String
}
```

**Enums:**
```typescript
enum SalesOrderStatus {
  DRAFT
  PENDING
  APPROVED
  PARTIALLY_INVOICED
  INVOICED
  CANCELLED
}
```

#### 5.2 Sales Order Lines
```typescript
SalesOrderLine {
  // مشابه لـ PurchaseOrderLine
}
```

#### 5.3 Sales Invoices (فواتير المبيعات)
```typescript
SalesInvoice {
  // مشابه لـ PurchaseInvoice
}
```

#### 5.4 Sales Invoice Lines
```typescript
SalesInvoiceLine {
  // مشابه لـ PurchaseInvoiceLine
}
```

#### 5.5 Sales Returns (مرتجعات المبيعات)
```typescript
SalesReturn {
  // مشابه لـ PurchaseReturn
}
```

#### 5.6 Sales Return Lines
```typescript
SalesReturnLine {
  // مشابه لـ PurchaseReturnLine
}
```

---

## 📊 ملخص الجداول

| النظام | عدد الجداول | الجداول |
|--------|-------------|---------|
| الموردين | 4 | SupplierCategory, Supplier, SupplierAddress, SupplierContact |
| العملاء | 4 | CustomerCategory, Customer, CustomerAddress, CustomerContact |
| المخزون | 7 | ItemCategory, Item, Warehouse, StockLevel, StockMovement, StockCount, StockCountLine |
| المشتريات | 6 | PurchaseOrder, PurchaseOrderLine, PurchaseInvoice, PurchaseInvoiceLine, PurchaseReturn, PurchaseReturnLine |
| المبيعات | 6 | SalesOrder, SalesOrderLine, SalesInvoice, SalesInvoiceLine, SalesReturn, SalesReturnLine |
| **المجموع** | **27** | |

---

## 🔗 التكامل مع الأنظمة السابقة

### 1. التكامل مع Multi-Entity System
- جميع الجداول الرئيسية تدعم `holdingId`, `unitId`, `projectId`

### 2. التكامل مع Chart of Accounts
- `Item` يرتبط بـ 3 حسابات: salesAccount, purchaseAccount, inventoryAccount
- `PurchaseInvoice` و `SalesInvoice` يرتبطان بـ `JournalEntry`

### 3. التكامل مع Cost Centers
- `PurchaseOrder`, `SalesOrder` يمكن ربطهم بمراكز التكلفة

### 4. التكامل مع Fiscal Years
- جميع الفواتير والقيود ترتبط بالسنة المالية

---

## 🔐 معايير الأمان والدقة

### 1. Validation Rules
- جميع الأكواد Unique ومفهرسة
- جميع الأرقام المالية Decimal(15,2)
- جميع الكميات Decimal(10,2)
- جميع النسب Decimal(5,2)

### 2. Business Rules
- لا يمكن حذف Supplier/Customer إذا كان لديه فواتير
- لا يمكن تعديل فاتورة مرحّلة
- لا يمكن صرف كمية أكبر من المتاح في المخزون
- الرصيد الحالي للعميل/المورد يتم تحديثه تلقائياً

### 3. Audit Trail
- جميع الجداول لديها createdAt, updatedAt, createdBy, updatedBy
- الفواتير لديها postedAt, postedBy
- الطلبات لديها approvedAt, approvedBy

### 4. Soft Delete
- Supplier, Customer, Item, Warehouse تستخدم isActive بدلاً من الحذف الفعلي

---

## 📝 ملاحظات مهمة

1. **Stock Management:**
   - `StockLevel` يتم تحديثه تلقائياً عند إنشاء `StockMovement`
   - `availableQuantity` = `quantity` - `reservedQuantity`

2. **Invoice Posting:**
   - عند ترحيل فاتورة شراء/مبيعات، يتم:
     - إنشاء `JournalEntry` تلقائياً
     - إنشاء `StockMovement` للأصناف
     - تحديث `currentBalance` للمورد/العميل

3. **Order to Invoice:**
   - يمكن إنشاء فاتورة من طلب
   - يتم تتبع `receivedQuantity` في `PurchaseOrderLine`
   - يتم تتبع `invoicedQuantity` في `SalesOrderLine`

4. **Returns:**
   - المرتجعات ترتبط بالفاتورة الأصلية
   - تنشئ `StockMovement` عكسي
   - تنشئ `JournalEntry` عكسي

---

**🎯 التصميم جاهز للتطبيق!**

**التالي:** بناء Prisma Schema
