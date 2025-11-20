# SEMOP - تصميم نموذج البيانات المحاسبي

**الإصدار:** v0.3.0  
**التاريخ:** 2025-11-20  
**المرحلة:** 3 - الوحدات المحاسبية الأساسية

---

## 📋 نظرة عامة

تم تصميم نموذج بيانات محاسبي شامل ومتكامل يدعم جميع العمليات المحاسبية الأساسية، مع مراعاة المعايير المحاسبية الدولية وأفضل الممارسات في تصميم قواعد البيانات المحاسبية.

### الأنظمة المحاسبية الأربعة

يتكون النموذج من أربعة أنظمة رئيسية متكاملة تشكل الأساس لأي نظام محاسبي احترافي:

**نظام دليل الحسابات (Chart of Accounts)** يوفر البنية الأساسية لتصنيف وتنظيم جميع الحسابات المحاسبية في المؤسسة. يدعم النظام هيكل شجري متعدد المستويات (Parent-Child) مع خمسة أنواع رئيسية من الحسابات وفقاً للمعايير المحاسبية.

**نظام القيود اليومية (Journal Entries)** يسجل جميع العمليات المالية في المؤسسة من خلال قيود محاسبية متوازنة (المدين = الدائن). يدعم النظام القيود البسيطة والمركبة مع إمكانية الترحيل والعكس والتدقيق.

**نظام مراكز التكلفة (Cost Centers)** يسمح بتتبع التكاليف والإيرادات حسب الأقسام أو المشاريع أو الأنشطة المختلفة، مما يوفر رؤية تفصيلية لأداء كل مركز تكلفة.

**نظام السنوات المالية (Fiscal Years)** يدير الفترات المحاسبية والسنوات المالية، مع دعم فتح وإغلاق الفترات وترحيل الأرصدة بين السنوات.

---

## 🗄️ الجداول والعلاقات

### 1. نظام دليل الحسابات (3 جداول)

#### جدول Accounts (الحسابات)

يمثل هذا الجدول جميع الحسابات المحاسبية في المؤسسة، سواء كانت حسابات رئيسية أو فرعية.

**الحقول الأساسية:**
- `id` (UUID): المعرف الفريد للحساب
- `code` (String, Unique): رمز الحساب (مثل: 1010, 2010)
- `nameAr` (String): اسم الحساب بالعربية
- `nameEn` (String): اسم الحساب بالإنجليزية
- `description` (String, Optional): وصف الحساب
- `accountType` (Enum): نوع الحساب (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE)
- `accountNature` (Enum): طبيعة الحساب (DEBIT, CREDIT)
- `level` (Integer): مستوى الحساب في الشجرة (1, 2, 3, ...)
- `isParent` (Boolean): هل الحساب رئيسي (يحتوي على حسابات فرعية)
- `isActive` (Boolean): حالة التفعيل
- `allowManualEntry` (Boolean): السماح بالقيد المباشر (false للحسابات الرئيسية)
- `parentId` (UUID, Optional): معرف الحساب الأب
- `holdingId` (UUID, Optional): ربط بشركة قابضة محددة
- `unitId` (UUID, Optional): ربط بوحدة محددة
- `createdAt`, `updatedAt`: تواريخ الإنشاء والتحديث
- `createdBy`, `updatedBy`: معرفات المستخدمين

**العلاقات:**
- علاقة Self-Referencing مع نفس الجدول (Parent-Child)
- علاقة One-to-Many مع JournalEntryLines
- علاقة Many-to-One مع Holding (Optional)
- علاقة Many-to-One مع Unit (Optional)

**الفهارس:**
- Unique Index على `code`
- Index على `accountType`
- Index على `parentId`
- Index على `holdingId`
- Index على `unitId`
- Index على `isActive`
- Index على `allowManualEntry`

#### جدول AccountBalances (أرصدة الحسابات)

يخزن الأرصدة الافتتاحية والختامية للحسابات في كل سنة مالية.

**الحقول:**
- `id` (UUID): المعرف الفريد
- `accountId` (UUID): معرف الحساب
- `fiscalYearId` (UUID): معرف السنة المالية
- `openingBalance` (Decimal): الرصيد الافتتاحي
- `closingBalance` (Decimal): الرصيد الختامي
- `debitTotal` (Decimal): إجمالي المدين خلال الفترة
- `creditTotal` (Decimal): إجمالي الدائن خلال الفترة
- `createdAt`, `updatedAt`: تواريخ الإنشاء والتحديث

**العلاقات:**
- Many-to-One مع Account
- Many-to-One مع FiscalYear

**الفهارس:**
- Unique Index على `(accountId, fiscalYearId)`
- Index على `accountId`
- Index على `fiscalYearId`

#### جدول AccountHierarchy (التسلسل الهرمي للحسابات)

جدول مساعد لتسريع الاستعلامات الهرمية (Materialized Path).

**الحقول:**
- `id` (UUID): المعرف الفريد
- `accountId` (UUID): معرف الحساب
- `ancestorId` (UUID): معرف الحساب الجد
- `depth` (Integer): عمق العلاقة (0 للحساب نفسه، 1 للأب المباشر، إلخ)

**العلاقات:**
- Many-to-One مع Account (accountId)
- Many-to-One مع Account (ancestorId)

**الفهارس:**
- Index على `(accountId, ancestorId)`
- Index على `accountId`
- Index على `ancestorId`

---

### 2. نظام القيود اليومية (2 جداول)

#### جدول JournalEntries (القيود اليومية)

يمثل رأس القيد المحاسبي.

**الحقول:**
- `id` (UUID): المعرف الفريد
- `entryNumber` (String, Unique): رقم القيد (مثل: JE-2025-0001)
- `entryDate` (DateTime): تاريخ القيد
- `description` (String): وصف القيد
- `reference` (String, Optional): مرجع خارجي (رقم فاتورة، شيك، إلخ)
- `entryType` (Enum): نوع القيد (OPENING, REGULAR, CLOSING, ADJUSTMENT)
- `status` (Enum): حالة القيد (DRAFT, POSTED, REVERSED)
- `totalDebit` (Decimal): إجمالي المدين
- `totalCredit` (Decimal): إجمالي الدائن
- `isBalanced` (Boolean): هل القيد متوازن (Computed)
- `postedAt` (DateTime, Optional): تاريخ الترحيل
- `postedBy` (UUID, Optional): من قام بالترحيل
- `reversedAt` (DateTime, Optional): تاريخ العكس
- `reversedBy` (UUID, Optional): من قام بالعكس
- `reversalOfId` (UUID, Optional): معرف القيد المعكوس
- `fiscalYearId` (UUID): معرف السنة المالية
- `holdingId` (UUID, Optional): ربط بشركة قابضة
- `unitId` (UUID, Optional): ربط بوحدة
- `projectId` (UUID, Optional): ربط بمشروع
- `createdAt`, `updatedAt`: تواريخ الإنشاء والتحديث
- `createdBy`, `updatedBy`: معرفات المستخدمين

**العلاقات:**
- One-to-Many مع JournalEntryLines
- Many-to-One مع FiscalYear
- Many-to-One مع Holding (Optional)
- Many-to-One مع Unit (Optional)
- Many-to-One مع Project (Optional)
- Self-Referencing (reversalOfId)

**الفهارس:**
- Unique Index على `entryNumber`
- Index على `entryDate`
- Index على `status`
- Index على `fiscalYearId`
- Index على `holdingId`
- Index على `unitId`
- Index على `projectId`

#### جدول JournalEntryLines (سطور القيد)

يمثل سطور القيد المحاسبي (التفاصيل).

**الحقول:**
- `id` (UUID): المعرف الفريد
- `journalEntryId` (UUID): معرف القيد
- `lineNumber` (Integer): رقم السطر (1, 2, 3, ...)
- `accountId` (UUID): معرف الحساب
- `description` (String): وصف السطر
- `debit` (Decimal): المبلغ المدين (0 إذا كان دائن)
- `credit` (Decimal): المبلغ الدائن (0 إذا كان مدين)
- `costCenterId` (UUID, Optional): معرف مركز التكلفة
- `createdAt`, `updatedAt`: تواريخ الإنشاء والتحديث

**العلاقات:**
- Many-to-One مع JournalEntry
- Many-to-One مع Account
- Many-to-One مع CostCenter (Optional)

**الفهارس:**
- Index على `journalEntryId`
- Index على `accountId`
- Index على `costCenterId`
- Index على `(journalEntryId, lineNumber)` (Unique)

**قيود البيانات (Constraints):**
- Check: `(debit = 0 AND credit > 0) OR (debit > 0 AND credit = 0)` (لا يمكن أن يكون السطر مدين ودائن في نفس الوقت)
- Check: `debit >= 0 AND credit >= 0`

---

### 3. نظام مراكز التكلفة (1 جدول)

#### جدول CostCenters (مراكز التكلفة)

يمثل مراكز التكلفة المختلفة في المؤسسة.

**الحقول:**
- `id` (UUID): المعرف الفريد
- `code` (String, Unique): رمز مركز التكلفة
- `nameAr` (String): الاسم بالعربية
- `nameEn` (String): الاسم بالإنجليزية
- `description` (String, Optional): الوصف
- `isActive` (Boolean): حالة التفعيل
- `parentId` (UUID, Optional): معرف المركز الأب (هيكل شجري)
- `holdingId` (UUID, Optional): ربط بشركة قابضة
- `unitId` (UUID, Optional): ربط بوحدة
- `projectId` (UUID, Optional): ربط بمشروع
- `createdAt`, `updatedAt`: تواريخ الإنشاء والتحديث
- `createdBy`, `updatedBy`: معرفات المستخدمين

**العلاقات:**
- Self-Referencing (Parent-Child)
- One-to-Many مع JournalEntryLines
- Many-to-One مع Holding (Optional)
- Many-to-One مع Unit (Optional)
- Many-to-One مع Project (Optional)

**الفهارس:**
- Unique Index على `code`
- Index على `parentId`
- Index على `holdingId`
- Index على `unitId`
- Index على `projectId`
- Index على `isActive`

---

### 4. نظام السنوات المالية (2 جداول)

#### جدول FiscalYears (السنوات المالية)

يمثل السنوات المالية للمؤسسة.

**الحقول:**
- `id` (UUID): المعرف الفريد
- `code` (String, Unique): رمز السنة المالية (مثل: FY-2025)
- `nameAr` (String): الاسم بالعربية
- `nameEn` (String): الاسم بالإنجليزية
- `startDate` (DateTime): تاريخ بداية السنة المالية
- `endDate` (DateTime): تاريخ نهاية السنة المالية
- `status` (Enum): حالة السنة (OPEN, CLOSED, LOCKED)
- `isCurrent` (Boolean): هل هي السنة الحالية
- `holdingId` (UUID, Optional): ربط بشركة قابضة
- `createdAt`, `updatedAt`: تواريخ الإنشاء والتحديث
- `createdBy`, `updatedBy`: معرفات المستخدمين

**العلاقات:**
- One-to-Many مع FiscalPeriods
- One-to-Many مع JournalEntries
- One-to-Many مع AccountBalances
- Many-to-One مع Holding (Optional)

**الفهارس:**
- Unique Index على `code`
- Index على `startDate`
- Index على `endDate`
- Index على `status`
- Index على `isCurrent`
- Index على `holdingId`

**قيود البيانات:**
- Check: `endDate > startDate`
- Unique Index على `(holdingId, isCurrent)` WHERE `isCurrent = true` (سنة مالية حالية واحدة فقط لكل Holding)

#### جدول FiscalPeriods (الفترات المحاسبية)

يمثل الفترات المحاسبية ضمن السنة المالية (شهور عادة).

**الحقول:**
- `id` (UUID): المعرف الفريد
- `fiscalYearId` (UUID): معرف السنة المالية
- `periodNumber` (Integer): رقم الفترة (1-12 للشهور)
- `nameAr` (String): الاسم بالعربية (يناير، فبراير، ...)
- `nameEn` (String): الاسم بالإنجليزية (January, February, ...)
- `startDate` (DateTime): تاريخ بداية الفترة
- `endDate` (DateTime): تاريخ نهاية الفترة
- `status` (Enum): حالة الفترة (OPEN, CLOSED)
- `createdAt`, `updatedAt`: تواريخ الإنشاء والتحديث

**العلاقات:**
- Many-to-One مع FiscalYear

**الفهارس:**
- Unique Index على `(fiscalYearId, periodNumber)`
- Index على `fiscalYearId`
- Index على `status`
- Index على `startDate`
- Index على `endDate`

**قيود البيانات:**
- Check: `endDate > startDate`
- Check: `periodNumber >= 1 AND periodNumber <= 12`

---

## 📊 الأنواع المعرفة (Enums)

### AccountType (نوع الحساب)
- `ASSET`: أصول
- `LIABILITY`: خصوم (التزامات)
- `EQUITY`: حقوق ملكية
- `REVENUE`: إيرادات
- `EXPENSE`: مصروفات

### AccountNature (طبيعة الحساب)
- `DEBIT`: مدين (الأصول والمصروفات)
- `CREDIT`: دائن (الخصوم وحقوق الملكية والإيرادات)

### JournalEntryType (نوع القيد)
- `OPENING`: قيد افتتاحي
- `REGULAR`: قيد عادي
- `CLOSING`: قيد إقفال
- `ADJUSTMENT`: قيد تسوية

### JournalEntryStatus (حالة القيد)
- `DRAFT`: مسودة (قابل للتعديل)
- `POSTED`: مرحّل (غير قابل للتعديل)
- `REVERSED`: معكوس

### FiscalYearStatus (حالة السنة المالية)
- `OPEN`: مفتوحة (قابلة للقيد)
- `CLOSED`: مغلقة (غير قابلة للقيد)
- `LOCKED`: مقفلة (مغلقة نهائياً)

### FiscalPeriodStatus (حالة الفترة المحاسبية)
- `OPEN`: مفتوحة
- `CLOSED`: مغلقة

---

## 🔗 ملخص العلاقات

### علاقات نظام دليل الحسابات
- Account → Account (Parent-Child, Self-Referencing)
- Account → Holding (Many-to-One, Optional)
- Account → Unit (Many-to-One, Optional)
- Account → JournalEntryLine (One-to-Many)
- AccountBalance → Account (Many-to-One)
- AccountBalance → FiscalYear (Many-to-One)
- AccountHierarchy → Account (Many-to-One, accountId)
- AccountHierarchy → Account (Many-to-One, ancestorId)

### علاقات نظام القيود اليومية
- JournalEntry → FiscalYear (Many-to-One)
- JournalEntry → Holding (Many-to-One, Optional)
- JournalEntry → Unit (Many-to-One, Optional)
- JournalEntry → Project (Many-to-One, Optional)
- JournalEntry → JournalEntry (Self-Referencing, reversalOfId)
- JournalEntry → JournalEntryLine (One-to-Many)
- JournalEntryLine → Account (Many-to-One)
- JournalEntryLine → CostCenter (Many-to-One, Optional)

### علاقات نظام مراكز التكلفة
- CostCenter → CostCenter (Parent-Child, Self-Referencing)
- CostCenter → Holding (Many-to-One, Optional)
- CostCenter → Unit (Many-to-One, Optional)
- CostCenter → Project (Many-to-One, Optional)
- CostCenter → JournalEntryLine (One-to-Many)

### علاقات نظام السنوات المالية
- FiscalYear → Holding (Many-to-One, Optional)
- FiscalYear → FiscalPeriod (One-to-Many)
- FiscalYear → JournalEntry (One-to-Many)
- FiscalYear → AccountBalance (One-to-Many)
- FiscalPeriod → FiscalYear (Many-to-One)

---

## 📈 إحصائيات التصميم

| المكون | العدد |
|--------|-------|
| جداول جديدة | 10 |
| Enums جديدة | 6 |
| علاقات | 25+ |
| فهارس | 40+ |
| قيود البيانات | 10+ |

### توزيع الجداول حسب النظام

| النظام | عدد الجداول |
|--------|-------------|
| دليل الحسابات | 3 |
| القيود اليومية | 2 |
| مراكز التكلفة | 1 |
| السنوات المالية | 2 |
| جداول مساعدة | 2 |
| **المجموع** | **10** |

---

## ✅ أفضل الممارسات المُتبعة

### التصميم المحاسبي
- ✅ فصل رأس القيد عن السطور (Header-Detail Pattern)
- ✅ دعم الهيكل الشجري للحسابات (Parent-Child)
- ✅ التحقق من توازن القيد (Debit = Credit)
- ✅ دعم عكس القيود (Reversal)
- ✅ تتبع حالات القيد (Draft, Posted, Reversed)
- ✅ دعم الفترات المحاسبية
- ✅ دعم مراكز التكلفة
- ✅ الأرصدة الافتتاحية والختامية

### قاعدة البيانات
- ✅ استخدام UUID للمعرفات
- ✅ Audit Trail كامل (createdAt, updatedAt, createdBy, updatedBy)
- ✅ Soft Delete (isActive)
- ✅ فهارس محسّنة للأداء
- ✅ قيود البيانات (Constraints)
- ✅ Unique Constraints حيث مطلوب
- ✅ Cascade Delete حيث مناسب
- ✅ Optional Relations حيث مطلوب

### الأمان والتدقيق
- ✅ تتبع من أنشأ/عدّل كل سجل
- ✅ تتبع تواريخ الترحيل والعكس
- ✅ حماية القيود المرحّلة من التعديل
- ✅ تتبع القيود المعكوسة

---

## 🎯 الخطوات التالية

1. ✅ تصميم نموذج البيانات (مكتمل)
2. 🔜 بناء Prisma Schema
3. 🔜 إنشاء Migration
4. 🔜 بناء Services
5. 🔜 بناء DTOs
6. 🔜 الاختبارات والتوثيق

---

**الحالة:** ✅ تصميم نموذج البيانات مكتمل  
**التاريخ:** 2025-11-20  
**المطور:** SEMOP Development Team
