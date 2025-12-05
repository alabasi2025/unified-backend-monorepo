# Shared Contracts

هذا المجلد يحتوي على العقود المشتركة (DTOs, Types, Interfaces) بين Backend و Frontend.

## الهيكل

```
contracts/
├── dtos/           # كائنات نقل البيانات
├── enums/          # التعدادات
├── types/          # الأنواع المخصصة
├── validation/     # قواعد التحقق
└── index.ts        # نقطة التصدير الرئيسية
```

## الاستخدام

### في Backend (NestJS)
```typescript
import { UserDto, CreateUserDto } from '@semop/contracts';
```

### في Frontend (Angular)
```typescript
import { UserDto, CreateUserDto } from '@semop/contracts';
```

## ملاحظات

- تم دمج هذا المجلد من مستودع `shared-contracts-repo` السابق
- جميع التعديلات على العقود يجب أن تتم هنا
- يتم استيراد العقود محلياً عبر `file:./libs/contracts`
