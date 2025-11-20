# SEMOP - HR & Payroll Database Design
# تصميم قاعدة بيانات نظام الموارد البشرية والرواتب

**Version:** 0.5.0  
**Date:** November 20, 2025  
**Status:** Design Phase

---

## 📋 Overview

تصميم شامل لقاعدة بيانات نظام الموارد البشرية والرواتب يغطي إدارة الموظفين، الحضور والانصراف، الإجازات، الرواتب، والخصومات والبدلات مع تكامل كامل مع الأنظمة المحاسبية والكيانات المتعددة.

---

## 🗄️ Database Tables

### 1. Employee Management (إدارة الموظفين) - 6 Tables

#### 1.1 employees
جدول الموظفين الرئيسي

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الموظف |
| code | VARCHAR(20) | UNIQUE, NOT NULL | كود الموظف |
| firstName | VARCHAR(100) | NOT NULL | الاسم الأول |
| middleName | VARCHAR(100) | | الاسم الأوسط |
| lastName | VARCHAR(100) | NOT NULL | اسم العائلة |
| firstNameAr | VARCHAR(100) | NOT NULL | الاسم الأول بالعربية |
| middleNameAr | VARCHAR(100) | | الاسم الأوسط بالعربية |
| lastNameAr | VARCHAR(100) | NOT NULL | اسم العائلة بالعربية |
| nationalId | VARCHAR(20) | UNIQUE | رقم الهوية الوطنية |
| passportNumber | VARCHAR(20) | UNIQUE | رقم جواز السفر |
| dateOfBirth | DATE | NOT NULL | تاريخ الميلاد |
| gender | ENUM | NOT NULL | الجنس (MALE, FEMALE) |
| maritalStatus | ENUM | NOT NULL | الحالة الاجتماعية |
| nationality | VARCHAR(100) | | الجنسية |
| email | VARCHAR(200) | UNIQUE | البريد الإلكتروني |
| phone | VARCHAR(20) | | الهاتف |
| mobile | VARCHAR(20) | | الجوال |
| address | TEXT | | العنوان |
| city | VARCHAR(100) | | المدينة |
| country | VARCHAR(100) | | الدولة |
| postalCode | VARCHAR(20) | | الرمز البريدي |
| hireDate | DATE | NOT NULL | تاريخ التعيين |
| terminationDate | DATE | | تاريخ إنهاء الخدمة |
| employmentStatus | ENUM | NOT NULL | حالة التوظيف |
| employmentType | ENUM | NOT NULL | نوع التوظيف |
| probationEndDate | DATE | | تاريخ انتهاء فترة التجربة |
| departmentId | UUID | FK | معرف القسم |
| positionId | UUID | FK | معرف الوظيفة |
| managerId | UUID | FK (self) | معرف المدير المباشر |
| workLocationId | UUID | FK | معرف موقع العمل |
| bankName | VARCHAR(100) | | اسم البنك |
| bankAccountNumber | VARCHAR(50) | | رقم الحساب البنكي |
| bankIBAN | VARCHAR(50) | | رقم الآيبان |
| emergencyContactName | VARCHAR(200) | | اسم جهة الاتصال للطوارئ |
| emergencyContactPhone | VARCHAR(20) | | هاتف جهة الاتصال للطوارئ |
| emergencyContactRelation | VARCHAR(50) | | صلة القرابة |
| holdingId | UUID | FK | معرف الشركة القابضة |
| unitId | UUID | FK | معرف الوحدة |
| projectId | UUID | FK | معرف المشروع |
| notes | TEXT | | ملاحظات |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

**Indexes:**
- idx_employees_code (code)
- idx_employees_national_id (nationalId)
- idx_employees_email (email)
- idx_employees_department (departmentId)
- idx_employees_position (positionId)
- idx_employees_manager (managerId)
- idx_employees_status (employmentStatus)
- idx_employees_holding (holdingId)
- idx_employees_hire_date (hireDate)

#### 1.2 departments
جدول الأقسام

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف القسم |
| code | VARCHAR(20) | UNIQUE, NOT NULL | كود القسم |
| nameEn | VARCHAR(200) | NOT NULL | اسم القسم بالإنجليزية |
| nameAr | VARCHAR(200) | NOT NULL | اسم القسم بالعربية |
| parentId | UUID | FK (self) | معرف القسم الأب |
| managerId | UUID | FK (Employee) | معرف مدير القسم |
| costCenterId | UUID | FK | معرف مركز التكلفة |
| holdingId | UUID | FK | معرف الشركة القابضة |
| unitId | UUID | FK | معرف الوحدة |
| projectId | UUID | FK | معرف المشروع |
| description | TEXT | | الوصف |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 1.3 positions
جدول الوظائف

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الوظيفة |
| code | VARCHAR(20) | UNIQUE, NOT NULL | كود الوظيفة |
| titleEn | VARCHAR(200) | NOT NULL | المسمى الوظيفي بالإنجليزية |
| titleAr | VARCHAR(200) | NOT NULL | المسمى الوظيفي بالعربية |
| level | ENUM | NOT NULL | المستوى الوظيفي |
| category | ENUM | NOT NULL | فئة الوظيفة |
| minSalary | DECIMAL(15,2) | | الحد الأدنى للراتب |
| maxSalary | DECIMAL(15,2) | | الحد الأقصى للراتب |
| description | TEXT | | الوصف الوظيفي |
| requirements | TEXT | | المتطلبات |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 1.4 work_locations
جدول مواقع العمل

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الموقع |
| code | VARCHAR(20) | UNIQUE, NOT NULL | كود الموقع |
| nameEn | VARCHAR(200) | NOT NULL | اسم الموقع بالإنجليزية |
| nameAr | VARCHAR(200) | NOT NULL | اسم الموقع بالعربية |
| address | TEXT | | العنوان |
| city | VARCHAR(100) | | المدينة |
| country | VARCHAR(100) | | الدولة |
| latitude | DECIMAL(10,8) | | خط العرض |
| longitude | DECIMAL(11,8) | | خط الطول |
| radius | INT | | نطاق الموقع (بالأمتار) |
| holdingId | UUID | FK | معرف الشركة القابضة |
| unitId | UUID | FK | معرف الوحدة |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 1.5 employee_documents
جدول مستندات الموظفين

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف المستند |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| documentType | ENUM | NOT NULL | نوع المستند |
| documentNumber | VARCHAR(50) | | رقم المستند |
| title | VARCHAR(200) | NOT NULL | عنوان المستند |
| issueDate | DATE | | تاريخ الإصدار |
| expiryDate | DATE | | تاريخ الانتهاء |
| filePath | VARCHAR(500) | | مسار الملف |
| fileSize | INT | | حجم الملف (بايت) |
| mimeType | VARCHAR(100) | | نوع الملف |
| notes | TEXT | | ملاحظات |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| createdBy | UUID | FK (User) | أنشئ بواسطة |

#### 1.6 employee_contracts
جدول عقود الموظفين

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف العقد |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| contractNumber | VARCHAR(50) | UNIQUE, NOT NULL | رقم العقد |
| contractType | ENUM | NOT NULL | نوع العقد |
| startDate | DATE | NOT NULL | تاريخ البداية |
| endDate | DATE | | تاريخ النهاية |
| basicSalary | DECIMAL(15,2) | NOT NULL | الراتب الأساسي |
| currency | VARCHAR(3) | DEFAULT 'SAR' | العملة |
| workingHoursPerDay | DECIMAL(4,2) | | ساعات العمل اليومية |
| workingDaysPerWeek | INT | | أيام العمل الأسبوعية |
| annualLeaveDays | INT | | أيام الإجازة السنوية |
| probationPeriodDays | INT | | فترة التجربة (أيام) |
| noticePeriodDays | INT | | فترة الإشعار (أيام) |
| filePath | VARCHAR(500) | | مسار ملف العقد |
| status | ENUM | NOT NULL | حالة العقد |
| notes | TEXT | | ملاحظات |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

---

### 2. Attendance Management (الحضور والانصراف) - 4 Tables

#### 2.1 attendance_records
جدول سجلات الحضور

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف السجل |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| date | DATE | NOT NULL | التاريخ |
| checkInTime | TIMESTAMP | | وقت الحضور |
| checkOutTime | TIMESTAMP | | وقت الانصراف |
| checkInLocation | VARCHAR(200) | | موقع الحضور |
| checkOutLocation | VARCHAR(200) | | موقع الانصراف |
| checkInLatitude | DECIMAL(10,8) | | خط عرض الحضور |
| checkInLongitude | DECIMAL(11,8) | | خط طول الحضور |
| checkOutLatitude | DECIMAL(10,8) | | خط عرض الانصراف |
| checkOutLongitude | DECIMAL(11,8) | | خط طول الانصراف |
| checkInMethod | ENUM | | طريقة الحضور |
| checkOutMethod | ENUM | | طريقة الانصراف |
| workingHours | DECIMAL(5,2) | | ساعات العمل |
| overtimeHours | DECIMAL(5,2) | | ساعات إضافية |
| lateMinutes | INT | | دقائق التأخير |
| earlyLeaveMinutes | INT | | دقائق المغادرة المبكرة |
| status | ENUM | NOT NULL | الحالة |
| shiftId | UUID | FK | معرف الوردية |
| notes | TEXT | | ملاحظات |
| approvedBy | UUID | FK (User) | اعتمد بواسطة |
| approvedAt | TIMESTAMP | | تاريخ الاعتماد |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |

**Indexes:**
- idx_attendance_employee_date (employeeId, date)
- idx_attendance_date (date)
- idx_attendance_status (status)

**Unique Constraint:**
- unique_attendance_employee_date (employeeId, date)

#### 2.2 shifts
جدول الورديات

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الوردية |
| code | VARCHAR(20) | UNIQUE, NOT NULL | كود الوردية |
| nameEn | VARCHAR(100) | NOT NULL | اسم الوردية بالإنجليزية |
| nameAr | VARCHAR(100) | NOT NULL | اسم الوردية بالعربية |
| startTime | TIME | NOT NULL | وقت البداية |
| endTime | TIME | NOT NULL | وقت النهاية |
| workingHours | DECIMAL(4,2) | NOT NULL | ساعات العمل |
| breakMinutes | INT | DEFAULT 0 | دقائق الاستراحة |
| graceMinutes | INT | DEFAULT 0 | دقائق السماح |
| isOvernight | BOOLEAN | DEFAULT FALSE | وردية ليلية |
| color | VARCHAR(7) | | لون الوردية |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 2.3 employee_shifts
جدول ربط الموظفين بالورديات

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف السجل |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| shiftId | UUID | FK, NOT NULL | معرف الوردية |
| effectiveDate | DATE | NOT NULL | تاريخ السريان |
| endDate | DATE | | تاريخ الانتهاء |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| createdBy | UUID | FK (User) | أنشئ بواسطة |

#### 2.4 overtime_requests
جدول طلبات العمل الإضافي

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الطلب |
| requestNumber | VARCHAR(50) | UNIQUE, NOT NULL | رقم الطلب |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| date | DATE | NOT NULL | التاريخ |
| startTime | TIME | NOT NULL | وقت البداية |
| endTime | TIME | NOT NULL | وقت النهاية |
| hours | DECIMAL(5,2) | NOT NULL | عدد الساعات |
| reason | TEXT | NOT NULL | السبب |
| status | ENUM | NOT NULL | الحالة |
| requestedAt | TIMESTAMP | NOT NULL | تاريخ الطلب |
| approvedBy | UUID | FK (User) | اعتمد بواسطة |
| approvedAt | TIMESTAMP | | تاريخ الاعتماد |
| rejectionReason | TEXT | | سبب الرفض |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |

---

### 3. Leave Management (إدارة الإجازات) - 3 Tables

#### 3.1 leave_types
جدول أنواع الإجازات

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف النوع |
| code | VARCHAR(20) | UNIQUE, NOT NULL | كود النوع |
| nameEn | VARCHAR(100) | NOT NULL | الاسم بالإنجليزية |
| nameAr | VARCHAR(100) | NOT NULL | الاسم بالعربية |
| isPaid | BOOLEAN | DEFAULT TRUE | مدفوعة |
| maxDaysPerYear | INT | | الحد الأقصى للأيام سنوياً |
| requiresApproval | BOOLEAN | DEFAULT TRUE | تتطلب اعتماد |
| canCarryForward | BOOLEAN | DEFAULT FALSE | يمكن ترحيلها |
| color | VARCHAR(7) | | اللون |
| description | TEXT | | الوصف |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 3.2 leave_balances
جدول أرصدة الإجازات

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الرصيد |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| leaveTypeId | UUID | FK, NOT NULL | معرف نوع الإجازة |
| year | INT | NOT NULL | السنة |
| entitlement | DECIMAL(5,2) | NOT NULL | الاستحقاق |
| used | DECIMAL(5,2) | DEFAULT 0 | المستخدم |
| balance | DECIMAL(5,2) | NOT NULL | الرصيد |
| carriedForward | DECIMAL(5,2) | DEFAULT 0 | المرحل |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |

**Unique Constraint:**
- unique_leave_balance (employeeId, leaveTypeId, year)

#### 3.3 leave_requests
جدول طلبات الإجازات

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الطلب |
| requestNumber | VARCHAR(50) | UNIQUE, NOT NULL | رقم الطلب |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| leaveTypeId | UUID | FK, NOT NULL | معرف نوع الإجازة |
| startDate | DATE | NOT NULL | تاريخ البداية |
| endDate | DATE | NOT NULL | تاريخ النهاية |
| days | DECIMAL(5,2) | NOT NULL | عدد الأيام |
| reason | TEXT | | السبب |
| status | ENUM | NOT NULL | الحالة |
| requestedAt | TIMESTAMP | NOT NULL | تاريخ الطلب |
| approvedBy | UUID | FK (User) | اعتمد بواسطة |
| approvedAt | TIMESTAMP | | تاريخ الاعتماد |
| rejectionReason | TEXT | | سبب الرفض |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |

**Indexes:**
- idx_leave_requests_employee (employeeId)
- idx_leave_requests_status (status)
- idx_leave_requests_dates (startDate, endDate)

---

### 4. Payroll Management (إدارة الرواتب) - 5 Tables

#### 4.1 payroll_periods
جدول فترات الرواتب

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الفترة |
| periodNumber | VARCHAR(50) | UNIQUE, NOT NULL | رقم الفترة |
| year | INT | NOT NULL | السنة |
| month | INT | NOT NULL | الشهر |
| startDate | DATE | NOT NULL | تاريخ البداية |
| endDate | DATE | NOT NULL | تاريخ النهاية |
| paymentDate | DATE | | تاريخ الدفع |
| status | ENUM | NOT NULL | الحالة |
| totalEmployees | INT | DEFAULT 0 | عدد الموظفين |
| totalGrossPay | DECIMAL(15,2) | DEFAULT 0 | إجمالي الرواتب |
| totalDeductions | DECIMAL(15,2) | DEFAULT 0 | إجمالي الخصومات |
| totalNetPay | DECIMAL(15,2) | DEFAULT 0 | صافي الرواتب |
| processedAt | TIMESTAMP | | تاريخ المعالجة |
| processedBy | UUID | FK (User) | معالج بواسطة |
| approvedAt | TIMESTAMP | | تاريخ الاعتماد |
| approvedBy | UUID | FK (User) | اعتمد بواسطة |
| journalEntryId | UUID | FK | معرف القيد المحاسبي |
| holdingId | UUID | FK | معرف الشركة القابضة |
| unitId | UUID | FK | معرف الوحدة |
| notes | TEXT | | ملاحظات |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |

**Unique Constraint:**
- unique_payroll_period (year, month, holdingId, unitId)

#### 4.2 payroll_items
جدول سطور الرواتب

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف السطر |
| payrollPeriodId | UUID | FK, NOT NULL | معرف فترة الرواتب |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| basicSalary | DECIMAL(15,2) | NOT NULL | الراتب الأساسي |
| allowances | DECIMAL(15,2) | DEFAULT 0 | البدلات |
| overtimePay | DECIMAL(15,2) | DEFAULT 0 | أجر العمل الإضافي |
| bonuses | DECIMAL(15,2) | DEFAULT 0 | المكافآت |
| grossPay | DECIMAL(15,2) | NOT NULL | إجمالي الراتب |
| deductions | DECIMAL(15,2) | DEFAULT 0 | الخصومات |
| netPay | DECIMAL(15,2) | NOT NULL | صافي الراتب |
| workingDays | INT | | أيام العمل |
| absentDays | INT | DEFAULT 0 | أيام الغياب |
| overtimeHours | DECIMAL(5,2) | DEFAULT 0 | ساعات إضافية |
| status | ENUM | NOT NULL | الحالة |
| paidAt | TIMESTAMP | | تاريخ الدفع |
| paymentMethod | ENUM | | طريقة الدفع |
| paymentReference | VARCHAR(100) | | مرجع الدفع |
| notes | TEXT | | ملاحظات |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |

**Indexes:**
- idx_payroll_items_period (payrollPeriodId)
- idx_payroll_items_employee (employeeId)

**Unique Constraint:**
- unique_payroll_item (payrollPeriodId, employeeId)

#### 4.3 payroll_allowances
جدول بدلات الرواتب

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف البدل |
| payrollItemId | UUID | FK, NOT NULL | معرف سطر الراتب |
| allowanceTypeId | UUID | FK, NOT NULL | معرف نوع البدل |
| amount | DECIMAL(15,2) | NOT NULL | المبلغ |
| notes | TEXT | | ملاحظات |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |

#### 4.4 payroll_deductions
جدول خصومات الرواتب

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الخصم |
| payrollItemId | UUID | FK, NOT NULL | معرف سطر الراتب |
| deductionTypeId | UUID | FK, NOT NULL | معرف نوع الخصم |
| amount | DECIMAL(15,2) | NOT NULL | المبلغ |
| notes | TEXT | | ملاحظات |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |

#### 4.5 payroll_bonuses
جدول مكافآت الرواتب

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف المكافأة |
| payrollItemId | UUID | FK, NOT NULL | معرف سطر الراتب |
| bonusTypeId | UUID | FK, NOT NULL | معرف نوع المكافأة |
| amount | DECIMAL(15,2) | NOT NULL | المبلغ |
| notes | TEXT | | ملاحظات |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |

---

### 5. Deductions & Benefits (الخصومات والبدلات) - 6 Tables

#### 5.1 allowance_types
جدول أنواع البدلات

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف النوع |
| code | VARCHAR(20) | UNIQUE, NOT NULL | كود النوع |
| nameEn | VARCHAR(100) | NOT NULL | الاسم بالإنجليزية |
| nameAr | VARCHAR(100) | NOT NULL | الاسم بالعربية |
| calculationType | ENUM | NOT NULL | نوع الحساب |
| defaultAmount | DECIMAL(15,2) | | المبلغ الافتراضي |
| defaultPercentage | DECIMAL(5,2) | | النسبة الافتراضية |
| isTaxable | BOOLEAN | DEFAULT TRUE | خاضع للضريبة |
| accountId | UUID | FK | معرف الحساب المحاسبي |
| description | TEXT | | الوصف |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 5.2 deduction_types
جدول أنواع الخصومات

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف النوع |
| code | VARCHAR(20) | UNIQUE, NOT NULL | كود النوع |
| nameEn | VARCHAR(100) | NOT NULL | الاسم بالإنجليزية |
| nameAr | VARCHAR(100) | NOT NULL | الاسم بالعربية |
| calculationType | ENUM | NOT NULL | نوع الحساب |
| defaultAmount | DECIMAL(15,2) | | المبلغ الافتراضي |
| defaultPercentage | DECIMAL(5,2) | | النسبة الافتراضية |
| isStatutory | BOOLEAN | DEFAULT FALSE | إلزامي قانوناً |
| accountId | UUID | FK | معرف الحساب المحاسبي |
| description | TEXT | | الوصف |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 5.3 bonus_types
جدول أنواع المكافآت

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف النوع |
| code | VARCHAR(20) | UNIQUE, NOT NULL | كود النوع |
| nameEn | VARCHAR(100) | NOT NULL | الاسم بالإنجليزية |
| nameAr | VARCHAR(100) | NOT NULL | الاسم بالعربية |
| calculationType | ENUM | NOT NULL | نوع الحساب |
| defaultAmount | DECIMAL(15,2) | | المبلغ الافتراضي |
| defaultPercentage | DECIMAL(5,2) | | النسبة الافتراضية |
| isTaxable | BOOLEAN | DEFAULT TRUE | خاضع للضريبة |
| accountId | UUID | FK | معرف الحساب المحاسبي |
| description | TEXT | | الوصف |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 5.4 employee_allowances
جدول بدلات الموظفين الثابتة

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف البدل |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| allowanceTypeId | UUID | FK, NOT NULL | معرف نوع البدل |
| amount | DECIMAL(15,2) | | المبلغ |
| percentage | DECIMAL(5,2) | | النسبة |
| effectiveDate | DATE | NOT NULL | تاريخ السريان |
| endDate | DATE | | تاريخ الانتهاء |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 5.5 employee_deductions
جدول خصومات الموظفين الثابتة

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الخصم |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| deductionTypeId | UUID | FK, NOT NULL | معرف نوع الخصم |
| amount | DECIMAL(15,2) | | المبلغ |
| percentage | DECIMAL(5,2) | | النسبة |
| effectiveDate | DATE | NOT NULL | تاريخ السريان |
| endDate | DATE | | تاريخ الانتهاء |
| isActive | BOOLEAN | DEFAULT TRUE | نشط |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |
| createdBy | UUID | FK (User) | أنشئ بواسطة |
| updatedBy | UUID | FK (User) | حُدث بواسطة |

#### 5.6 loan_requests
جدول طلبات السلف

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | معرف الطلب |
| requestNumber | VARCHAR(50) | UNIQUE, NOT NULL | رقم الطلب |
| employeeId | UUID | FK, NOT NULL | معرف الموظف |
| amount | DECIMAL(15,2) | NOT NULL | المبلغ |
| installments | INT | NOT NULL | عدد الأقساط |
| installmentAmount | DECIMAL(15,2) | NOT NULL | مبلغ القسط |
| startDate | DATE | NOT NULL | تاريخ البداية |
| reason | TEXT | NOT NULL | السبب |
| status | ENUM | NOT NULL | الحالة |
| paidInstallments | INT | DEFAULT 0 | الأقساط المدفوعة |
| remainingAmount | DECIMAL(15,2) | | المبلغ المتبقي |
| requestedAt | TIMESTAMP | NOT NULL | تاريخ الطلب |
| approvedBy | UUID | FK (User) | اعتمد بواسطة |
| approvedAt | TIMESTAMP | | تاريخ الاعتماد |
| rejectionReason | TEXT | | سبب الرفض |
| createdAt | TIMESTAMP | | تاريخ الإنشاء |
| updatedAt | TIMESTAMP | | تاريخ التحديث |

---

## 🏷️ Enums

### 1. Employee Enums

```typescript
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}

enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
  RESIGNED = 'RESIGNED',
  RETIRED = 'RETIRED'
}

enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  TEMPORARY = 'TEMPORARY',
  INTERN = 'INTERN'
}

enum PositionLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  INTERMEDIATE = 'INTERMEDIATE',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR',
  EXECUTIVE = 'EXECUTIVE'
}

enum PositionCategory {
  TECHNICAL = 'TECHNICAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  SALES = 'SALES',
  OPERATIONS = 'OPERATIONS',
  FINANCE = 'FINANCE',
  HR = 'HR',
  LEGAL = 'LEGAL',
  OTHER = 'OTHER'
}

enum DocumentType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  WORK_PERMIT = 'WORK_PERMIT',
  VISA = 'VISA',
  CERTIFICATE = 'CERTIFICATE',
  CONTRACT = 'CONTRACT',
  OTHER = 'OTHER'
}

enum ContractType {
  PERMANENT = 'PERMANENT',
  FIXED_TERM = 'FIXED_TERM',
  PROBATION = 'PROBATION',
  TEMPORARY = 'TEMPORARY'
}

enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED'
}
```

### 2. Attendance Enums

```typescript
enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EARLY_LEAVE = 'EARLY_LEAVE',
  ON_LEAVE = 'ON_LEAVE',
  HOLIDAY = 'HOLIDAY',
  WEEKEND = 'WEEKEND'
}

enum CheckMethod {
  BIOMETRIC = 'BIOMETRIC',
  MOBILE_APP = 'MOBILE_APP',
  WEB = 'WEB',
  MANUAL = 'MANUAL'
}

enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}
```

### 3. Payroll Enums

```typescript
enum PayrollPeriodStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CLOSED = 'CLOSED'
}

enum PayrollItemStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID'
}

enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  CHEQUE = 'CHEQUE'
}

enum CalculationType {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  PERCENTAGE = 'PERCENTAGE',
  FORMULA = 'FORMULA'
}
```

---

## 📊 Summary

| Category | Tables | Enums |
|----------|--------|-------|
| Employee Management | 6 | 8 |
| Attendance Management | 4 | 3 |
| Leave Management | 3 | 1 |
| Payroll Management | 5 | 4 |
| Deductions & Benefits | 6 | 1 |
| **Total** | **24** | **17** |

---

## 🔗 Key Relationships

1. **Employee → Department** (Many-to-One)
2. **Employee → Position** (Many-to-One)
3. **Employee → Manager** (Many-to-One, Self-referencing)
4. **Employee → Holding/Unit/Project** (Many-to-One)
5. **AttendanceRecord → Employee** (Many-to-One)
6. **AttendanceRecord → Shift** (Many-to-One)
7. **LeaveRequest → Employee** (Many-to-One)
8. **LeaveRequest → LeaveType** (Many-to-One)
9. **PayrollItem → Employee** (Many-to-One)
10. **PayrollItem → PayrollPeriod** (Many-to-One)
11. **PayrollPeriod → JournalEntry** (One-to-One)
12. **AllowanceType/DeductionType/BonusType → Account** (Many-to-One)

---

## ✅ Design Principles

1. **Normalization**: جميع الجداول منظمة حسب 3NF
2. **Audit Trail**: جميع الجداول تحتوي على createdAt, updatedAt, createdBy, updatedBy
3. **Soft Delete**: استخدام isActive بدلاً من الحذف الفعلي
4. **Multi-Entity**: دعم Holding/Unit/Project في جميع الجداول الرئيسية
5. **Indexing**: فهارس على جميع الأعمدة المستخدمة في البحث والفلترة
6. **Constraints**: قيود Unique و Foreign Key لضمان سلامة البيانات
7. **Enums**: استخدام Enums لتحديد القيم المسموحة
8. **Decimal Precision**: استخدام DECIMAL(15,2) للمبالغ المالية

---

**Document Version:** 1.0  
**Last Updated:** November 20, 2025  
**Status:** Ready for Implementation
