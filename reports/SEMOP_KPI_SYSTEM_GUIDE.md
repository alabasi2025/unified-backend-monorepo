# 📊 نظام مؤشرات الأداء الرئيسية (KPI) - SEMOP ERP

**الإصدار**: v1.0  
**تاريخ الإنشاء**: 2025-11-21  
**المؤلف**: فريق تطوير SEMOP  
**النطاق**: جميع أنظمة SEMOP ERP

---

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [فلسفة النظام](#فلسفة-النظام)
3. [مؤشرات الأداء الرئيسية](#مؤشرات-الأداء-الرئيسية)
4. [البنية التقنية](#البنية-التقنية)
5. [نظام المراقبة الآلي](#نظام-المراقبة-الآلي)
6. [لوحة التحكم](#لوحة-التحكم)
7. [التقارير الدورية](#التقارير-الدورية)
8. [التنبيهات والإشعارات](#التنبيهات-والإشعارات)
9. [التطبيق على الأنظمة](#التطبيق-على-الأنظمة)
10. [دليل التنفيذ](#دليل-التنفيذ)

---

## نظرة عامة

نظام مؤشرات الأداء الرئيسية (KPI System) هو إطار عمل شامل لمراقبة وقياس جودة وأداء جميع مكونات نظام SEMOP ERP. يوفر النظام رؤية واضحة وقابلة للقياس لصحة كل نظام فرعي، مما يساعد في اتخاذ قرارات مستنيرة وتحسين مستمر للجودة.

### الأهداف الاستراتيجية

يهدف نظام KPI إلى تحقيق عدة أهداف رئيسية تخدم رؤية SEMOP الشاملة. **الشفافية الكاملة** تعني توفير رؤية واضحة لحالة كل نظام في أي وقت، مما يمكّن الإدارة من فهم الوضع الحالي بدقة. **الجودة المستدامة** تضمن الحفاظ على معايير عالية للجودة عبر جميع الأنظمة من خلال المراقبة المستمرة والتحسين الدوري. **الاستباقية** تعني اكتشاف المشاكل قبل أن تؤثر على المستخدمين من خلال نظام تنبيهات ذكي. **التحسين المستمر** يوفر بيانات دقيقة لاتخاذ قرارات تحسين مبنية على أدلة واقعية. **المساءلة** تحدد مسؤوليات واضحة لكل فريق عن جودة نظامه.

### نطاق التطبيق

النظام مصمم ليشمل جميع مكونات SEMOP ERP بدون استثناء. **الأنظمة الأساسية** تشمل نظام الخرائط، نظام المحاسبة، نظام الموارد البشرية، نظام إدارة المشاريع، نظام المخزون، نظام المبيعات، ونظام المشتريات. **الأنظمة الداعمة** تشمل نظام التوثيق، نظام الإشعارات، نظام الصلاحيات، ونظام التقارير. **البنية التحتية** تشمل قواعد البيانات، الخوادم، APIs، والشبكات. **تجربة المستخدم** تشمل واجهات المستخدم، الأداء، وسهولة الاستخدام.

---

## فلسفة النظام

### المبادئ الأساسية

نظام KPI يقوم على مجموعة من المبادئ الراسخة التي تضمن فعاليته وقابليته للتطبيق. **القياس الموضوعي** يعني أن كل مؤشر يجب أن يكون قابلاً للقياس الكمي وليس ذاتياً، مما يضمن عدالة التقييم. **البساطة** تعني أن المؤشرات يجب أن تكون سهلة الفهم والتفسير لجميع أصحاب المصلحة. **الارتباط بالأهداف** يضمن أن كل مؤشر يرتبط مباشرة بأهداف العمل الاستراتيجية. **القابلية للتنفيذ** تعني أن البيانات المستخرجة يجب أن تؤدي إلى إجراءات تحسين واضحة. **الاستمرارية** تضمن أن القياس يتم بشكل دوري ومستمر وليس لمرة واحدة.

### منهجية SMART

جميع مؤشرات الأداء في النظام تتبع منهجية SMART المعترف بها عالمياً. **Specific (محدد)** يعني أن كل مؤشر يقيس جانباً محدداً وواضحاً من الأداء. **Measurable (قابل للقياس)** يضمن أن المؤشر يمكن قياسه بأرقام دقيقة. **Achievable (قابل للتحقيق)** يعني أن الأهداف المحددة واقعية وليست مستحيلة. **Relevant (ذو صلة)** يضمن أن المؤشر مرتبط بأهداف العمل الفعلية. **Time-bound (محدد زمنياً)** يعني أن كل مؤشر له إطار زمني واضح للتقييم.

---

## مؤشرات الأداء الرئيسية

### 1. مؤشرات جودة المحتوى (Content Quality KPIs)

هذه المؤشرات تقيس جودة واكتمال المحتوى في جميع أنظمة التوثيق والبيانات.

#### 1.1 حجم المحتوى (Content Size)

**الوصف**: قياس حجم المحتوى بالكيلوبايت والأحرف لضمان الشمولية.

**القياس**:
- حجم الملف بالكيلوبايت (KB)
- عدد الأحرف الإجمالي
- عدد الكلمات

**القيمة الأساسية** (Baseline):
- نظام الخرائط: 36 KB، 23,976 حرف، ~4,000 كلمة
- الحد الأدنى المقبول: 20 KB، 10,000 حرف
- الحد الأمثل: 30+ KB، 20,000+ حرف

**المعادلة**:
```
Content Size Score = (Current Size / Baseline Size) × 100
```

**التفسير**:
- 100%+: ممتاز (محتوى شامل ومفصل)
- 80-99%: جيد (محتوى كافٍ)
- 60-79%: مقبول (يحتاج تحسين)
- <60%: ضعيف (محتوى غير كافٍ)

#### 1.2 اكتمال المحتوى (Content Completeness)

**الوصف**: قياس مدى اكتمال الأقسام المطلوبة في كل وثيقة.

**القياس**:
- عدد الأقسام الرئيسية الموجودة
- عدد الأقسام الفرعية الموجودة
- نسبة الأقسام المكتملة

**القيمة الأساسية**:
- نظام الخرائط: 10 أقسام رئيسية، 60+ قسم فرعي
- الحد الأدنى: 5 أقسام رئيسية، 20+ قسم فرعي

**المعادلة**:
```
Completeness Score = (Completed Sections / Required Sections) × 100
```

**الأقسام المطلوبة** (لكل نظام):
1. نظرة عامة
2. المخطط المعماري
3. مخطط قاعدة البيانات
4. مخطط APIs
5. البنية التقنية
6. الميزات الأساسية
7. التكامل مع SEMOP
8. الأمان والصلاحيات
9. الأداء والتحسين
10. الاختبار والنشر

#### 1.3 حداثة المحتوى (Content Freshness)

**الوصف**: قياس مدى حداثة المحتوى وتحديثه المستمر.

**القياس**:
- عدد الأيام منذ آخر تحديث
- عدد التحديثات في الشهر الأخير
- عدد التحديثات في الربع الأخير

**القيمة الأساسية**:
- التحديث المثالي: كل 7-14 يوم
- التحديث المقبول: كل 30 يوم
- التحديث الحرج: أكثر من 90 يوم

**المعادلة**:
```
Freshness Score = 100 - (Days Since Last Update / 90) × 100
```

**التفسير**:
- 90-100%: محدث جداً (<7 أيام)
- 70-89%: محدث (7-30 يوم)
- 50-69%: يحتاج تحديث (30-60 يوم)
- <50%: قديم جداً (>60 يوم)

#### 1.4 جودة الهيكلة (Structure Quality)

**الوصف**: قياس جودة تنظيم وهيكلة المحتوى.

**القياس**:
- عدد الجداول التوضيحية
- عدد المخططات والرسوم
- عدد أمثلة الكود
- عدد الروابط الداخلية

**القيمة الأساسية**:
- نظام الخرائط: 15+ جدول، 5+ مخططات، 10+ أمثلة كود
- الحد الأدنى: 5+ جداول، 2+ مخططات، 5+ أمثلة

**المعادلة**:
```
Structure Score = (Tables×2 + Diagrams×3 + Code Examples×1) / 50 × 100
```

### 2. مؤشرات الأداء التقني (Technical Performance KPIs)

#### 2.1 وقت الاستجابة (Response Time)

**الوصف**: قياس سرعة استجابة APIs والخدمات.

**القياس**:
- متوسط وقت الاستجابة (ms)
- أقصى وقت استجابة (ms)
- النسبة المئوية للطلبات السريعة (<1s)

**القيمة الأساسية**:
- API التوثيق: <500ms متوسط، <2s أقصى
- APIs البيانات: <1s متوسط، <5s أقصى
- واجهة المستخدم: <2s تحميل كامل

**المعادلة**:
```
Performance Score = 100 - (Average Response Time / 5000) × 100
```

#### 2.2 معدل النجاح (Success Rate)

**الوصف**: قياس نسبة الطلبات الناجحة مقابل الفاشلة.

**القياس**:
- عدد الطلبات الناجحة (200 OK)
- عدد الطلبات الفاشلة (4xx, 5xx)
- نسبة النجاح

**القيمة الأساسية**:
- المثالي: 99.9%+
- المقبول: 99%+
- الحرج: <95%

**المعادلة**:
```
Success Rate = (Successful Requests / Total Requests) × 100
```

#### 2.3 الاستقرار (Stability)

**الوصف**: قياس استقرار النظام وعدم تعطله.

**القياس**:
- Uptime (وقت التشغيل)
- عدد الأعطال في الشهر
- متوسط وقت الإصلاح (MTTR)

**القيمة الأساسية**:
- Uptime المثالي: 99.9%+ (8.76 ساعات توقف سنوياً)
- Uptime المقبول: 99%+ (3.65 أيام توقف سنوياً)
- MTTR المثالي: <1 ساعة

**المعادلة**:
```
Stability Score = (Uptime Percentage + (100 - Downtime Hours/24)) / 2
```

#### 2.4 استهلاك الموارد (Resource Usage)

**الوصف**: قياس كفاءة استخدام موارد السيرفر.

**القياس**:
- استهلاك الذاكرة (MB)
- استهلاك CPU (%)
- استهلاك القرص (GB)

**القيمة الأساسية**:
- Backend: <200 MB ذاكرة، <10% CPU
- Database: <1 GB ذاكرة، <20% CPU
- Frontend: <50 MB نقل بيانات/يوم

**المعادلة**:
```
Efficiency Score = 100 - ((Memory Usage / 500) + (CPU Usage / 50)) × 50
```

### 3. مؤشرات تجربة المستخدم (User Experience KPIs)

#### 3.1 سهولة الاستخدام (Usability)

**الوصف**: قياس مدى سهولة استخدام النظام.

**القياس**:
- عدد النقرات للوصول للهدف
- وقت إتمام المهام الأساسية
- معدل الأخطاء

**القيمة الأساسية**:
- المهام الأساسية: <3 نقرات، <30 ثانية
- معدل الأخطاء: <5%

#### 3.2 رضا المستخدم (User Satisfaction)

**الوصف**: قياس رضا المستخدمين عن النظام.

**القياس**:
- تقييم المستخدمين (1-5 نجوم)
- عدد الشكاوى
- عدد طلبات الدعم

**القيمة الأساسية**:
- التقييم المثالي: 4.5+ نجوم
- الشكاوى المقبولة: <5 شكاوى/شهر
- طلبات الدعم: <20 طلب/شهر

#### 3.3 معدل الاستخدام (Usage Rate)

**الوصف**: قياس مدى استخدام النظام فعلياً.

**القياس**:
- عدد المستخدمين النشطين يومياً (DAU)
- عدد المستخدمين النشطين شهرياً (MAU)
- معدل الاحتفاظ (Retention Rate)

**القيمة الأساسية**:
- DAU/MAU المثالي: >40%
- Retention Rate: >80% بعد 30 يوم

### 4. مؤشرات الجودة الكودية (Code Quality KPIs)

#### 4.1 تغطية الاختبارات (Test Coverage)

**الوصف**: قياس نسبة الكود المغطى بالاختبارات.

**القياس**:
- نسبة تغطية الوحدات (Unit Tests)
- نسبة تغطية التكامل (Integration Tests)
- نسبة تغطية E2E

**القيمة الأساسية**:
- المثالي: >80% تغطية شاملة
- المقبول: >60% تغطية
- الحرج: <40% تغطية

#### 4.2 الديون التقنية (Technical Debt)

**الوصف**: قياس كمية الكود الذي يحتاج إعادة هيكلة.

**القياس**:
- عدد TODO/FIXME في الكود
- عدد Code Smells
- Complexity Score

**القيمة الأساسية**:
- TODO/FIXME المقبول: <50
- Code Smells: <100
- Complexity: <10 لكل دالة

#### 4.3 معدل الأخطاء (Bug Rate)

**الوصف**: قياس عدد الأخطاء المكتشفة.

**القياس**:
- عدد الأخطاء الحرجة
- عدد الأخطاء المتوسطة
- عدد الأخطاء البسيطة

**القيمة الأساسية**:
- الأخطاء الحرجة: 0
- الأخطاء المتوسطة: <5/شهر
- الأخطاء البسيطة: <20/شهر

### 5. مؤشرات الأمان (Security KPIs)

#### 5.1 الثغرات الأمنية (Vulnerabilities)

**الوصف**: قياس عدد الثغرات الأمنية المكتشفة.

**القياس**:
- عدد الثغرات الحرجة
- عدد الثغرات المتوسطة
- وقت إصلاح الثغرات

**القيمة الأساسية**:
- الثغرات الحرجة: 0
- الثغرات المتوسطة: <3
- وقت الإصلاح: <24 ساعة للحرجة

#### 5.2 الامتثال (Compliance)

**الوصف**: قياس مدى الامتثال لمعايير الأمان.

**القياس**:
- نسبة الامتثال لـ OWASP Top 10
- نسبة الامتثال لـ GDPR
- نسبة الامتثال للمعايير المحلية

**القيمة الأساسية**:
- الامتثال المثالي: 100%
- الامتثال المقبول: >90%

---

## البنية التقنية

### معمارية النظام

نظام KPI يتكون من عدة طبقات متكاملة تعمل معاً لتوفير مراقبة شاملة.

#### طبقة جمع البيانات (Data Collection Layer)

هذه الطبقة مسؤولة عن جمع البيانات من جميع المصادر. **Collectors** هي وحدات صغيرة تعمل بشكل دوري لجمع البيانات من كل نظام. **Agents** تعمل على كل سيرفر لجمع معلومات الأداء. **Webhooks** تستقبل أحداث فورية من الأنظمة. **Log Parsers** تحلل ملفات السجلات لاستخراج المعلومات.

#### طبقة معالجة البيانات (Data Processing Layer)

تقوم هذه الطبقة بمعالجة وتحليل البيانات المجمعة. **Aggregators** تجمع البيانات من مصادر متعددة. **Calculators** تحسب المؤشرات والنسب. **Analyzers** تحلل الاتجاهات والأنماط. **Validators** تتحقق من صحة البيانات.

#### طبقة التخزين (Storage Layer)

تخزن البيانات التاريخية والحالية. **Time Series Database** لتخزين البيانات الزمنية (مثل InfluxDB). **Document Database** لتخزين البيانات المعقدة (مثل MongoDB). **Cache** لتخزين البيانات المؤقتة (مثل Redis). **Archive** لتخزين البيانات القديمة.

#### طبقة العرض (Presentation Layer)

توفر واجهات لعرض البيانات. **Dashboard** لوحة تحكم تفاعلية. **Reports** تقارير دورية. **Alerts** تنبيهات فورية. **API** واجهة برمجية للوصول للبيانات.

### مخطط قاعدة البيانات

#### جدول Systems (الأنظمة)

```sql
CREATE TABLE systems (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(200) NOT NULL,
  category ENUM('core', 'support', 'infrastructure') NOT NULL,
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  baseline_size_kb INT,
  baseline_chars INT,
  baseline_sections INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### جدول KPI_Metrics (المؤشرات)

```sql
CREATE TABLE kpi_metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  system_id INT NOT NULL,
  metric_type ENUM('content', 'performance', 'ux', 'code', 'security') NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10, 2) NOT NULL,
  metric_unit VARCHAR(50),
  baseline_value DECIMAL(10, 2),
  threshold_min DECIMAL(10, 2),
  threshold_max DECIMAL(10, 2),
  score DECIMAL(5, 2),
  status ENUM('excellent', 'good', 'acceptable', 'poor') NOT NULL,
  measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (system_id) REFERENCES systems(id),
  INDEX idx_system_metric (system_id, metric_type, measured_at)
);
```

#### جدول KPI_History (السجل التاريخي)

```sql
CREATE TABLE kpi_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  system_id INT NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10, 2) NOT NULL,
  score DECIMAL(5, 2),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (system_id) REFERENCES systems(id),
  INDEX idx_system_time (system_id, recorded_at)
);
```

#### جدول KPI_Alerts (التنبيهات)

```sql
CREATE TABLE kpi_alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  system_id INT NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  alert_level ENUM('info', 'warning', 'critical') NOT NULL,
  message TEXT NOT NULL,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  acknowledged_at TIMESTAMP NULL,
  acknowledged_by INT NULL,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (system_id) REFERENCES systems(id),
  INDEX idx_system_level (system_id, alert_level, triggered_at)
);
```

#### جدول KPI_Reports (التقارير)

```sql
CREATE TABLE kpi_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  report_type ENUM('daily', 'weekly', 'monthly', 'quarterly') NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  overall_score DECIMAL(5, 2),
  content JSON,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type_period (report_type, period_start)
);
```

### مخطط APIs

#### 1. Systems API

```typescript
// GET /api/kpi/systems
// الحصول على قائمة جميع الأنظمة
Response: {
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    displayName: string;
    category: string;
    status: string;
    currentScore: number;
    lastUpdate: string;
  }>;
}

// GET /api/kpi/systems/:id
// الحصول على تفاصيل نظام محدد
Response: {
  success: boolean;
  data: {
    id: number;
    name: string;
    displayName: string;
    category: string;
    status: string;
    baseline: {
      sizeKb: number;
      chars: number;
      sections: number;
    };
    currentMetrics: Array<Metric>;
    overallScore: number;
  };
}
```

#### 2. Metrics API

```typescript
// GET /api/kpi/metrics/:systemId
// الحصول على جميع مؤشرات نظام محدد
Response: {
  success: boolean;
  data: Array<{
    id: number;
    metricType: string;
    metricName: string;
    metricValue: number;
    metricUnit: string;
    baselineValue: number;
    score: number;
    status: string;
    measuredAt: string;
  }>;
}

// POST /api/kpi/metrics/:systemId
// إضافة قياس جديد
Request: {
  metricType: string;
  metricName: string;
  metricValue: number;
  metricUnit?: string;
}
Response: {
  success: boolean;
  data: {
    id: number;
    score: number;
    status: string;
  };
}
```

#### 3. History API

```typescript
// GET /api/kpi/history/:systemId/:metricName
// الحصول على السجل التاريخي لمؤشر محدد
Query Parameters:
  - from: string (ISO date)
  - to: string (ISO date)
  - interval: 'hour' | 'day' | 'week' | 'month'

Response: {
  success: boolean;
  data: Array<{
    value: number;
    score: number;
    recordedAt: string;
  }>;
}
```

#### 4. Alerts API

```typescript
// GET /api/kpi/alerts
// الحصول على جميع التنبيهات النشطة
Query Parameters:
  - systemId?: number
  - level?: 'info' | 'warning' | 'critical'
  - status?: 'active' | 'acknowledged' | 'resolved'

Response: {
  success: boolean;
  data: Array<{
    id: number;
    systemId: number;
    systemName: string;
    metricName: string;
    level: string;
    message: string;
    triggeredAt: string;
    acknowledgedAt?: string;
    resolvedAt?: string;
  }>;
}

// POST /api/kpi/alerts/:id/acknowledge
// الإقرار بتنبيه
Response: {
  success: boolean;
  message: string;
}

// POST /api/kpi/alerts/:id/resolve
// حل تنبيه
Response: {
  success: boolean;
  message: string;
}
```

#### 5. Reports API

```typescript
// GET /api/kpi/reports
// الحصول على قائمة التقارير
Query Parameters:
  - type?: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  - from?: string (ISO date)
  - to?: string (ISO date)

Response: {
  success: boolean;
  data: Array<{
    id: number;
    reportType: string;
    periodStart: string;
    periodEnd: string;
    overallScore: number;
    generatedAt: string;
  }>;
}

// GET /api/kpi/reports/:id
// الحصول على تقرير محدد
Response: {
  success: boolean;
  data: {
    id: number;
    reportType: string;
    periodStart: string;
    periodEnd: string;
    overallScore: number;
    content: {
      summary: string;
      systems: Array<SystemReport>;
      trends: Array<Trend>;
      recommendations: Array<string>;
    };
    generatedAt: string;
  };
}

// POST /api/kpi/reports/generate
// توليد تقرير جديد
Request: {
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  periodStart: string;
  periodEnd: string;
}
Response: {
  success: boolean;
  data: {
    id: number;
    reportUrl: string;
  };
}
```

#### 6. Dashboard API

```typescript
// GET /api/kpi/dashboard
// الحصول على بيانات لوحة التحكم
Response: {
  success: boolean;
  data: {
    overallScore: number;
    systemsCount: number;
    activeAlertsCount: number;
    trends: {
      contentQuality: number;
      performance: number;
      userExperience: number;
      codeQuality: number;
      security: number;
    };
    topSystems: Array<{
      id: number;
      name: string;
      score: number;
    }>;
    recentAlerts: Array<Alert>;
    upcomingTasks: Array<Task>;
  };
}
```

---

## نظام المراقبة الآلي

### Collectors (جامعات البيانات)

#### Content Collector

```typescript
// content-collector.ts
import * as fs from 'fs';
import * as path from 'path';

interface ContentMetrics {
  sizeKb: number;
  chars: number;
  words: number;
  lines: number;
  sections: number;
  tables: number;
  codeBlocks: number;
}

export class ContentCollector {
  async collectMetrics(filePath: string): Promise<ContentMetrics> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const stats = await fs.promises.stat(filePath);
    
    return {
      sizeKb: Math.round(stats.size / 1024),
      chars: content.length,
      words: content.split(/\s+/).length,
      lines: content.split('\n').length,
      sections: (content.match(/^#{1,6}\s/gm) || []).length,
      tables: (content.match(/^\|/gm) || []).length / 3, // تقريبي
      codeBlocks: (content.match(/```/g) || []).length / 2,
    };
  }
  
  calculateScore(metrics: ContentMetrics, baseline: ContentMetrics): number {
    const sizeScore = (metrics.sizeKb / baseline.sizeKb) * 100;
    const sectionsScore = (metrics.sections / baseline.sections) * 100;
    const tablesScore = (metrics.tables / baseline.tables) * 100;
    
    return (sizeScore + sectionsScore + tablesScore) / 3;
  }
}
```

#### Performance Collector

```typescript
// performance-collector.ts
import axios from 'axios';

interface PerformanceMetrics {
  responseTime: number;
  statusCode: number;
  contentLength: number;
  ttfb: number; // Time to First Byte
}

export class PerformanceCollector {
  async collectMetrics(url: string): Promise<PerformanceMetrics> {
    const startTime = Date.now();
    let ttfb = 0;
    
    const response = await axios.get(url, {
      onDownloadProgress: (progressEvent) => {
        if (ttfb === 0) {
          ttfb = Date.now() - startTime;
        }
      },
    });
    
    const endTime = Date.now();
    
    return {
      responseTime: endTime - startTime,
      statusCode: response.status,
      contentLength: response.data.length || 0,
      ttfb,
    };
  }
  
  calculateScore(metrics: PerformanceMetrics): number {
    let score = 100;
    
    // خصم نقاط بناءً على وقت الاستجابة
    if (metrics.responseTime > 5000) score -= 50;
    else if (metrics.responseTime > 2000) score -= 30;
    else if (metrics.responseTime > 1000) score -= 15;
    else if (metrics.responseTime > 500) score -= 5;
    
    // خصم نقاط للأخطاء
    if (metrics.statusCode >= 500) score -= 50;
    else if (metrics.statusCode >= 400) score -= 30;
    
    return Math.max(0, score);
  }
}
```

#### System Health Collector

```typescript
// system-health-collector.ts
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface SystemHealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
  processCount: number;
}

export class SystemHealthCollector {
  async collectMetrics(): Promise<SystemHealthMetrics> {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    
    // حساب استخدام CPU
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpus.length;
    
    // حساب استخدام الذاكرة
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
    
    // حساب استخدام القرص
    const { stdout: dfOutput } = await execAsync('df -h / | tail -1');
    const diskUsage = parseInt(dfOutput.split(/\s+/)[4]);
    
    // حساب عدد العمليات
    const { stdout: psOutput } = await execAsync('ps aux | wc -l');
    const processCount = parseInt(psOutput.trim());
    
    return {
      cpuUsage: Math.round(cpuUsage),
      memoryUsage: Math.round(memoryUsage),
      diskUsage,
      uptime: os.uptime(),
      processCount,
    };
  }
  
  calculateScore(metrics: SystemHealthMetrics): number {
    let score = 100;
    
    // خصم نقاط بناءً على استخدام الموارد
    if (metrics.cpuUsage > 80) score -= 30;
    else if (metrics.cpuUsage > 60) score -= 15;
    else if (metrics.cpuUsage > 40) score -= 5;
    
    if (metrics.memoryUsage > 90) score -= 30;
    else if (metrics.memoryUsage > 75) score -= 15;
    else if (metrics.memoryUsage > 60) score -= 5;
    
    if (metrics.diskUsage > 90) score -= 20;
    else if (metrics.diskUsage > 80) score -= 10;
    
    return Math.max(0, score);
  }
}
```

### Scheduler (المجدول)

```typescript
// kpi-scheduler.ts
import cron from 'node-cron';
import { ContentCollector } from './content-collector';
import { PerformanceCollector } from './performance-collector';
import { SystemHealthCollector } from './system-health-collector';
import { KPIService } from './kpi-service';

export class KPIScheduler {
  private kpiService: KPIService;
  
  constructor(kpiService: KPIService) {
    this.kpiService = kpiService;
  }
  
  start() {
    // جمع مؤشرات المحتوى كل 6 ساعات
    cron.schedule('0 */6 * * *', async () => {
      console.log('Running content metrics collection...');
      await this.collectContentMetrics();
    });
    
    // جمع مؤشرات الأداء كل 15 دقيقة
    cron.schedule('*/15 * * * *', async () => {
      console.log('Running performance metrics collection...');
      await this.collectPerformanceMetrics();
    });
    
    // جمع مؤشرات صحة النظام كل 5 دقائق
    cron.schedule('*/5 * * * *', async () => {
      console.log('Running system health metrics collection...');
      await this.collectSystemHealthMetrics();
    });
    
    // توليد تقرير يومي في منتصف الليل
    cron.schedule('0 0 * * *', async () => {
      console.log('Generating daily report...');
      await this.kpiService.generateReport('daily');
    });
    
    // توليد تقرير أسبوعي كل يوم أحد
    cron.schedule('0 0 * * 0', async () => {
      console.log('Generating weekly report...');
      await this.kpiService.generateReport('weekly');
    });
    
    // توليد تقرير شهري في أول يوم من الشهر
    cron.schedule('0 0 1 * *', async () => {
      console.log('Generating monthly report...');
      await this.kpiService.generateReport('monthly');
    });
  }
  
  private async collectContentMetrics() {
    const systems = await this.kpiService.getAllSystems();
    const contentCollector = new ContentCollector();
    
    for (const system of systems) {
      try {
        const filePath = `/path/to/docs/${system.name}-guide.md`;
        const metrics = await contentCollector.collectMetrics(filePath);
        const score = contentCollector.calculateScore(metrics, system.baseline);
        
        await this.kpiService.saveMetric({
          systemId: system.id,
          metricType: 'content',
          metricName: 'content_size',
          metricValue: metrics.sizeKb,
          metricUnit: 'KB',
          baselineValue: system.baseline.sizeKb,
          score,
          status: this.getStatus(score),
        });
      } catch (error) {
        console.error(`Error collecting content metrics for ${system.name}:`, error);
      }
    }
  }
  
  private async collectPerformanceMetrics() {
    const systems = await this.kpiService.getAllSystems();
    const performanceCollector = new PerformanceCollector();
    
    for (const system of systems) {
      try {
        const url = `http://localhost/api/${system.name}`;
        const metrics = await performanceCollector.collectMetrics(url);
        const score = performanceCollector.calculateScore(metrics);
        
        await this.kpiService.saveMetric({
          systemId: system.id,
          metricType: 'performance',
          metricName: 'response_time',
          metricValue: metrics.responseTime,
          metricUnit: 'ms',
          score,
          status: this.getStatus(score),
        });
      } catch (error) {
        console.error(`Error collecting performance metrics for ${system.name}:`, error);
      }
    }
  }
  
  private async collectSystemHealthMetrics() {
    const healthCollector = new SystemHealthCollector();
    const metrics = await healthCollector.collectMetrics();
    const score = healthCollector.calculateScore(metrics);
    
    await this.kpiService.saveMetric({
      systemId: 0, // Infrastructure
      metricType: 'performance',
      metricName: 'system_health',
      metricValue: score,
      metricUnit: 'score',
      score,
      status: this.getStatus(score),
    });
  }
  
  private getStatus(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'acceptable';
    return 'poor';
  }
}
```

---

## لوحة التحكم

### تصميم الواجهة

لوحة التحكم هي الواجهة الرئيسية لعرض جميع مؤشرات الأداء بشكل مرئي وتفاعلي.

#### الصفحة الرئيسية (Overview)

تعرض ملخصاً شاملاً لحالة جميع الأنظمة.

**المكونات**:

1. **Overall Score Card**: بطاقة كبيرة تعرض النتيجة الإجمالية لجميع الأنظمة
   - رقم كبير (0-100)
   - مؤشر دائري (Gauge)
   - لون يتغير حسب الحالة (أخضر/أصفر/أحمر)

2. **Systems Summary**: ملخص سريع لجميع الأنظمة
   - عدد الأنظمة النشطة
   - عدد الأنظمة التي تحتاج انتباه
   - عدد التنبيهات النشطة

3. **Category Scores**: نتائج حسب الفئات
   - جودة المحتوى
   - الأداء التقني
   - تجربة المستخدم
   - جودة الكود
   - الأمان

4. **Top Performers**: أفضل 5 أنظمة أداءً
   - اسم النظام
   - النتيجة
   - الاتجاه (صاعد/هابط)

5. **Recent Alerts**: آخر 10 تنبيهات
   - مستوى التنبيه
   - النظام المتأثر
   - الرسالة
   - الوقت

6. **Trends Chart**: رسم بياني يوضح الاتجاهات
   - خط زمني للأسبوع/الشهر الماضي
   - مقارنة بين الفئات المختلفة

#### صفحة النظام (System Details)

تعرض تفاصيل كاملة عن نظام محدد.

**المكونات**:

1. **System Header**: معلومات أساسية
   - اسم النظام
   - الفئة
   - الحالة
   - النتيجة الإجمالية

2. **Metrics Grid**: شبكة المؤشرات
   - بطاقة لكل مؤشر
   - القيمة الحالية
   - القيمة الأساسية
   - النسبة المئوية للتغيير
   - الاتجاه

3. **Historical Charts**: رسوم بيانية تاريخية
   - رسم بياني لكل مؤشر
   - إمكانية اختيار الفترة الزمنية
   - مقارنة مع الأساس

4. **Alerts Panel**: لوحة التنبيهات
   - جميع التنبيهات المتعلقة بهذا النظام
   - إمكانية الإقرار والحل

5. **Recommendations**: توصيات التحسين
   - قائمة بالإجراءات المقترحة
   - الأولوية
   - الأثر المتوقع

#### صفحة التقارير (Reports)

تعرض جميع التقارير المولدة.

**المكونات**:

1. **Reports List**: قائمة التقارير
   - نوع التقرير
   - الفترة الزمنية
   - النتيجة الإجمالية
   - تاريخ التوليد

2. **Report Viewer**: عارض التقرير
   - ملخص تنفيذي
   - نتائج مفصلة لكل نظام
   - رسوم بيانية
   - توصيات

3. **Generate Report**: توليد تقرير جديد
   - اختيار النوع
   - اختيار الفترة
   - اختيار الأنظمة

### تنفيذ Frontend

```typescript
// kpi-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { KPIService } from './kpi.service';

@Component({
  selector: 'app-kpi-dashboard',
  templateUrl: './kpi-dashboard.component.html',
  styleUrls: ['./kpi-dashboard.component.scss']
})
export class KPIDashboardComponent implements OnInit {
  overallScore: number = 0;
  systemsCount: number = 0;
  activeAlertsCount: number = 0;
  
  categoryScores = {
    contentQuality: 0,
    performance: 0,
    userExperience: 0,
    codeQuality: 0,
    security: 0,
  };
  
  topSystems: any[] = [];
  recentAlerts: any[] = [];
  trendsData: any[] = [];
  
  constructor(private kpiService: KPIService) {}
  
  ngOnInit() {
    this.loadDashboardData();
  }
  
  async loadDashboardData() {
    const data = await this.kpiService.getDashboardData();
    
    this.overallScore = data.overallScore;
    this.systemsCount = data.systemsCount;
    this.activeAlertsCount = data.activeAlertsCount;
    this.categoryScores = data.trends;
    this.topSystems = data.topSystems;
    this.recentAlerts = data.recentAlerts;
    
    this.prepareTrendsChart(data.trends);
  }
  
  prepareTrendsChart(trends: any) {
    this.trendsData = [
      { name: 'جودة المحتوى', value: trends.contentQuality },
      { name: 'الأداء', value: trends.performance },
      { name: 'تجربة المستخدم', value: trends.userExperience },
      { name: 'جودة الكود', value: trends.codeQuality },
      { name: 'الأمان', value: trends.security },
    ];
  }
  
  getScoreColor(score: number): string {
    if (score >= 90) return '#10b981'; // أخضر
    if (score >= 70) return '#f59e0b'; // أصفر
    return '#ef4444'; // أحمر
  }
  
  getAlertColor(level: string): string {
    if (level === 'critical') return '#ef4444';
    if (level === 'warning') return '#f59e0b';
    return '#3b82f6';
  }
}
```

```html
<!-- kpi-dashboard.component.html -->
<div class="kpi-dashboard">
  <!-- Overall Score Card -->
  <div class="overall-score-card">
    <h2>النتيجة الإجمالية</h2>
    <div class="score-gauge">
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" stroke-width="20"/>
        <circle 
          cx="100" cy="100" r="90" 
          fill="none" 
          [attr.stroke]="getScoreColor(overallScore)" 
          stroke-width="20"
          [attr.stroke-dasharray]="565.48"
          [attr.stroke-dashoffset]="565.48 * (1 - overallScore / 100)"
          transform="rotate(-90 100 100)"/>
      </svg>
      <div class="score-value">{{ overallScore }}</div>
    </div>
  </div>
  
  <!-- Systems Summary -->
  <div class="systems-summary">
    <div class="summary-card">
      <h3>الأنظمة النشطة</h3>
      <p class="value">{{ systemsCount }}</p>
    </div>
    <div class="summary-card alert">
      <h3>التنبيهات النشطة</h3>
      <p class="value">{{ activeAlertsCount }}</p>
    </div>
  </div>
  
  <!-- Category Scores -->
  <div class="category-scores">
    <h2>النتائج حسب الفئات</h2>
    <div class="categories-grid">
      <div class="category-card" *ngFor="let category of categoryScores | keyvalue">
        <h3>{{ getCategoryName(category.key) }}</h3>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            [style.width.%]="category.value"
            [style.background-color]="getScoreColor(category.value)">
          </div>
        </div>
        <p class="score">{{ category.value }}%</p>
      </div>
    </div>
  </div>
  
  <!-- Top Performers -->
  <div class="top-performers">
    <h2>أفضل الأنظمة أداءً</h2>
    <table>
      <thead>
        <tr>
          <th>النظام</th>
          <th>النتيجة</th>
          <th>الاتجاه</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let system of topSystems">
          <td>{{ system.name }}</td>
          <td>
            <span [style.color]="getScoreColor(system.score)">
              {{ system.score }}
            </span>
          </td>
          <td>
            <i class="pi" [ngClass]="system.trend > 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <!-- Recent Alerts -->
  <div class="recent-alerts">
    <h2>التنبيهات الأخيرة</h2>
    <div class="alerts-list">
      <div 
        class="alert-item" 
        *ngFor="let alert of recentAlerts"
        [style.border-left-color]="getAlertColor(alert.level)">
        <div class="alert-header">
          <span class="alert-level">{{ alert.level }}</span>
          <span class="alert-time">{{ alert.triggeredAt | date:'short' }}</span>
        </div>
        <div class="alert-body">
          <strong>{{ alert.systemName }}</strong>
          <p>{{ alert.message }}</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Trends Chart -->
  <div class="trends-chart">
    <h2>الاتجاهات</h2>
    <ngx-charts-bar-vertical
      [results]="trendsData"
      [xAxis]="true"
      [yAxis]="true"
      [showXAxisLabel]="true"
      [showYAxisLabel]="true"
      xAxisLabel="الفئة"
      yAxisLabel="النتيجة"
      [gradient]="true">
    </ngx-charts-bar-vertical>
  </div>
</div>
```

---

## التقارير الدورية

### أنواع التقارير

#### 1. التقرير اليومي (Daily Report)

**المحتوى**:
- ملخص سريع لليوم
- أي تنبيهات حرجة
- التغييرات الملحوظة
- المهام المطلوبة

**التوقيت**: يومياً في منتصف الليل

**المستلمون**: فريق التطوير، مديرو الأنظمة

#### 2. التقرير الأسبوعي (Weekly Report)

**المحتوى**:
- ملخص الأسبوع
- الاتجاهات الأسبوعية
- مقارنة مع الأسبوع السابق
- أفضل وأسوأ أداء
- التوصيات الأسبوعية

**التوقيت**: كل يوم أحد

**المستلمون**: فريق التطوير، الإدارة التقنية

#### 3. التقرير الشهري (Monthly Report)

**المحتوى**:
- ملخص تنفيذي للشهر
- تحليل مفصل لكل نظام
- الاتجاهات الشهرية
- الإنجازات والتحديات
- خطة التحسين للشهر القادم

**التوقيت**: أول يوم من كل شهر

**المستلمون**: جميع أصحاب المصلحة

#### 4. التقرير الربع سنوي (Quarterly Report)

**المحتوى**:
- ملخص استراتيجي للربع
- تحليل عميق للاتجاهات
- ROI للتحسينات
- خارطة طريق الربع القادم

**التوقيت**: أول يوم من كل ربع

**المستلمون**: الإدارة العليا، أصحاب المصلحة الرئيسيون

### قالب التقرير

```typescript
// report-generator.ts
import { KPIService } from './kpi-service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

export class ReportGenerator {
  private kpiService: KPIService;
  
  constructor(kpiService: KPIService) {
    this.kpiService = kpiService;
  }
  
  async generateReport(
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly',
    periodStart: Date,
    periodEnd: Date
  ): Promise<string> {
    const data = await this.kpiService.getReportData(periodStart, periodEnd);
    
    const doc = new PDFDocument();
    const filename = `kpi-report-${type}-${periodStart.toISOString().split('T')[0]}.pdf`;
    const stream = fs.createWriteStream(filename);
    
    doc.pipe(stream);
    
    // Header
    this.addHeader(doc, type, periodStart, periodEnd);
    
    // Executive Summary
    this.addExecutiveSummary(doc, data);
    
    // Overall Scores
    this.addOverallScores(doc, data);
    
    // System Details
    for (const system of data.systems) {
      this.addSystemDetails(doc, system);
    }
    
    // Trends Analysis
    this.addTrendsAnalysis(doc, data);
    
    // Recommendations
    this.addRecommendations(doc, data);
    
    // Footer
    this.addFooter(doc);
    
    doc.end();
    
    return new Promise((resolve) => {
      stream.on('finish', () => resolve(filename));
    });
  }
  
  private addHeader(
    doc: PDFKit.PDFDocument,
    type: string,
    periodStart: Date,
    periodEnd: Date
  ) {
    doc.fontSize(24).text('تقرير مؤشرات الأداء - SEMOP ERP', { align: 'center' });
    doc.fontSize(14).text(`التقرير ${this.getReportTypeName(type)}`, { align: 'center' });
    doc.fontSize(12).text(
      `الفترة: ${periodStart.toLocaleDateString('ar')} - ${periodEnd.toLocaleDateString('ar')}`,
      { align: 'center' }
    );
    doc.moveDown(2);
  }
  
  private addExecutiveSummary(doc: PDFKit.PDFDocument, data: any) {
    doc.fontSize(18).text('الملخص التنفيذي');
    doc.moveDown();
    
    doc.fontSize(12).text(
      `النتيجة الإجمالية: ${data.overallScore}/100`,
      { continued: true }
    );
    doc.text(` (${this.getScoreLabel(data.overallScore)})`);
    
    doc.text(`عدد الأنظمة المراقبة: ${data.systemsCount}`);
    doc.text(`عدد التنبيهات: ${data.alertsCount}`);
    doc.text(`الأنظمة التي تحتاج انتباه: ${data.systemsNeedingAttention}`);
    
    doc.moveDown(2);
  }
  
  private addOverallScores(doc: PDFKit.PDFDocument, data: any) {
    doc.fontSize(18).text('النتائج الإجمالية');
    doc.moveDown();
    
    const categories = [
      { name: 'جودة المحتوى', score: data.contentQuality },
      { name: 'الأداء التقني', score: data.performance },
      { name: 'تجربة المستخدم', score: data.userExperience },
      { name: 'جودة الكود', score: data.codeQuality },
      { name: 'الأمان', score: data.security },
    ];
    
    for (const category of categories) {
      doc.fontSize(12).text(
        `${category.name}: ${category.score}/100 (${this.getScoreLabel(category.score)})`
      );
    }
    
    doc.moveDown(2);
  }
  
  private addSystemDetails(doc: PDFKit.PDFDocument, system: any) {
    doc.fontSize(16).text(`نظام ${system.name}`);
    doc.moveDown();
    
    doc.fontSize(12).text(`النتيجة: ${system.score}/100`);
    doc.text(`الحالة: ${system.status}`);
    doc.text(`عدد التنبيهات: ${system.alertsCount}`);
    
    doc.moveDown();
    doc.fontSize(14).text('المؤشرات:');
    
    for (const metric of system.metrics) {
      doc.fontSize(10).text(
        `  - ${metric.name}: ${metric.value} ${metric.unit} (${metric.score}/100)`
      );
    }
    
    doc.moveDown(2);
  }
  
  private addTrendsAnalysis(doc: PDFKit.PDFDocument, data: any) {
    doc.fontSize(18).text('تحليل الاتجاهات');
    doc.moveDown();
    
    doc.fontSize(12).text('الاتجاهات الملحوظة:');
    
    for (const trend of data.trends) {
      const arrow = trend.direction === 'up' ? '↑' : '↓';
      const color = trend.direction === 'up' ? 'green' : 'red';
      
      doc.text(`  ${arrow} ${trend.description}`, { color });
    }
    
    doc.moveDown(2);
  }
  
  private addRecommendations(doc: PDFKit.PDFDocument, data: any) {
    doc.fontSize(18).text('التوصيات');
    doc.moveDown();
    
    for (let i = 0; i < data.recommendations.length; i++) {
      doc.fontSize(12).text(`${i + 1}. ${data.recommendations[i]}`);
    }
    
    doc.moveDown(2);
  }
  
  private addFooter(doc: PDFKit.PDFDocument) {
    doc.fontSize(10).text(
      `تم التوليد بواسطة نظام KPI - SEMOP ERP`,
      { align: 'center' }
    );
    doc.text(
      `التاريخ: ${new Date().toLocaleString('ar')}`,
      { align: 'center' }
    );
  }
  
  private getReportTypeName(type: string): string {
    const names = {
      daily: 'اليومي',
      weekly: 'الأسبوعي',
      monthly: 'الشهري',
      quarterly: 'الربع سنوي',
    };
    return names[type] || type;
  }
  
  private getScoreLabel(score: number): string {
    if (score >= 90) return 'ممتاز';
    if (score >= 70) return 'جيد';
    if (score >= 50) return 'مقبول';
    return 'ضعيف';
  }
}
```

---

## التنبيهات والإشعارات

### نظام التنبيهات

نظام التنبيهات يراقب جميع المؤشرات ويرسل إشعارات فورية عند تجاوز الحدود المقبولة.

#### مستويات التنبيه

**Info (معلوماتي)**:
- تغيير طفيف في المؤشرات
- لا يتطلب إجراء فوري
- للعلم فقط

**Warning (تحذير)**:
- تجاوز الحد المقبول
- يتطلب انتباه قريب
- قد يؤثر على الأداء

**Critical (حرج)**:
- تجاوز الحد الحرج
- يتطلب إجراء فوري
- يؤثر على المستخدمين

#### قواعد التنبيه

```typescript
// alert-rules.ts
export interface AlertRule {
  metricName: string;
  condition: 'greater_than' | 'less_than' | 'equals';
  threshold: number;
  level: 'info' | 'warning' | 'critical';
  message: string;
}

export const alertRules: AlertRule[] = [
  // Content Quality Alerts
  {
    metricName: 'content_size',
    condition: 'less_than',
    threshold: 60,
    level: 'warning',
    message: 'حجم المحتوى أقل من المتوقع (أقل من 60% من الأساس)',
  },
  {
    metricName: 'content_size',
    condition: 'less_than',
    threshold: 40,
    level: 'critical',
    message: 'حجم المحتوى منخفض جداً (أقل من 40% من الأساس)',
  },
  {
    metricName: 'content_freshness',
    condition: 'less_than',
    threshold: 50,
    level: 'warning',
    message: 'المحتوى لم يتم تحديثه منذ أكثر من 60 يوم',
  },
  
  // Performance Alerts
  {
    metricName: 'response_time',
    condition: 'greater_than',
    threshold: 2000,
    level: 'warning',
    message: 'وقت الاستجابة بطيء (أكثر من 2 ثانية)',
  },
  {
    metricName: 'response_time',
    condition: 'greater_than',
    threshold: 5000,
    level: 'critical',
    message: 'وقت الاستجابة بطيء جداً (أكثر من 5 ثواني)',
  },
  {
    metricName: 'success_rate',
    condition: 'less_than',
    threshold: 95,
    level: 'critical',
    message: 'معدل النجاح منخفض (أقل من 95%)',
  },
  {
    metricName: 'uptime',
    condition: 'less_than',
    threshold: 99,
    level: 'critical',
    message: 'الاستقرار منخفض (Uptime أقل من 99%)',
  },
  
  // System Health Alerts
  {
    metricName: 'cpu_usage',
    condition: 'greater_than',
    threshold: 80,
    level: 'warning',
    message: 'استهلاك CPU مرتفع (أكثر من 80%)',
  },
  {
    metricName: 'memory_usage',
    condition: 'greater_than',
    threshold: 90,
    level: 'critical',
    message: 'استهلاك الذاكرة مرتفع جداً (أكثر من 90%)',
  },
  {
    metricName: 'disk_usage',
    condition: 'greater_than',
    threshold: 90,
    level: 'critical',
    message: 'مساحة القرص منخفضة (أكثر من 90% مستخدم)',
  },
  
  // Security Alerts
  {
    metricName: 'vulnerabilities_critical',
    condition: 'greater_than',
    threshold: 0,
    level: 'critical',
    message: 'تم اكتشاف ثغرات أمنية حرجة',
  },
  {
    metricName: 'failed_login_attempts',
    condition: 'greater_than',
    threshold: 10,
    level: 'warning',
    message: 'عدد محاولات تسجيل دخول فاشلة مرتفع',
  },
];
```

#### Alert Manager

```typescript
// alert-manager.ts
import { KPIService } from './kpi-service';
import { AlertRule, alertRules } from './alert-rules';
import { NotificationService } from './notification-service';

export class AlertManager {
  private kpiService: KPIService;
  private notificationService: NotificationService;
  
  constructor(
    kpiService: KPIService,
    notificationService: NotificationService
  ) {
    this.kpiService = kpiService;
    this.notificationService = notificationService;
  }
  
  async checkAlerts(systemId: number, metricName: string, metricValue: number) {
    const applicableRules = alertRules.filter(rule => rule.metricName === metricName);
    
    for (const rule of applicableRules) {
      if (this.shouldTriggerAlert(rule, metricValue)) {
        await this.triggerAlert(systemId, rule, metricValue);
      }
    }
  }
  
  private shouldTriggerAlert(rule: AlertRule, value: number): boolean {
    switch (rule.condition) {
      case 'greater_than':
        return value > rule.threshold;
      case 'less_than':
        return value < rule.threshold;
      case 'equals':
        return value === rule.threshold;
      default:
        return false;
    }
  }
  
  private async triggerAlert(
    systemId: number,
    rule: AlertRule,
    value: number
  ) {
    // Check if similar alert already exists
    const existingAlert = await this.kpiService.getActiveAlert(
      systemId,
      rule.metricName,
      rule.level
    );
    
    if (existingAlert) {
      // Don't create duplicate alert
      return;
    }
    
    // Create new alert
    const alert = await this.kpiService.createAlert({
      systemId,
      metricName: rule.metricName,
      level: rule.level,
      message: `${rule.message} (القيمة الحالية: ${value})`,
    });
    
    // Send notifications
    await this.sendNotifications(alert);
  }
  
  private async sendNotifications(alert: any) {
    const system = await this.kpiService.getSystem(alert.systemId);
    
    // Email notification
    if (alert.level === 'critical') {
      await this.notificationService.sendEmail({
        to: 'team@semop.com',
        subject: `[CRITICAL] تنبيه حرج - ${system.name}`,
        body: alert.message,
      });
    }
    
    // Slack notification
    await this.notificationService.sendSlack({
      channel: '#kpi-alerts',
      level: alert.level,
      system: system.name,
      message: alert.message,
    });
    
    // In-app notification
    await this.notificationService.sendInApp({
      userId: 'all',
      title: `تنبيه ${alert.level} - ${system.name}`,
      message: alert.message,
      link: `/kpi/systems/${system.id}`,
    });
  }
}
```

---

## التطبيق على الأنظمة

### نظام الخرائط (Maps System)

**القيمة الأساسية** (Baseline):
```json
{
  "name": "maps-system",
  "displayName": "نظام الخرائط",
  "category": "core",
  "baseline": {
    "sizeKb": 36,
    "chars": 23976,
    "sections": 10,
    "subsections": 60,
    "tables": 15,
    "diagrams": 5,
    "codeExamples": 10
  },
  "targets": {
    "contentQuality": 90,
    "performance": 85,
    "userExperience": 90,
    "codeQuality": 80,
    "security": 95
  }
}
```

**المؤشرات الخاصة**:
- عدد المواقع المضافة
- عدد الخرائط المحملة
- حجم Tiles المخزنة
- وقت تحميل الخريطة
- دقة الإحداثيات

### نظام المحاسبة (Accounting System)

**القيمة الأساسية**:
```json
{
  "name": "accounting-system",
  "displayName": "نظام المحاسبة",
  "category": "core",
  "baseline": {
    "sizeKb": 40,
    "chars": 25000,
    "sections": 12,
    "subsections": 70,
    "tables": 20
  },
  "targets": {
    "contentQuality": 95,
    "performance": 90,
    "userExperience": 85,
    "codeQuality": 90,
    "security": 95
  }
}
```

**المؤشرات الخاصة**:
- عدد القيود المحاسبية
- دقة الحسابات
- وقت إغلاق الفترة
- عدد التقارير المالية
- الامتثال للمعايير المحاسبية

### نظام الموارد البشرية (HR System)

**القيمة الأساسية**:
```json
{
  "name": "hr-system",
  "displayName": "نظام الموارد البشرية",
  "category": "core",
  "baseline": {
    "sizeKb": 35,
    "chars": 22000,
    "sections": 10,
    "subsections": 55,
    "tables": 18
  },
  "targets": {
    "contentQuality": 90,
    "performance": 85,
    "userExperience": 90,
    "codeQuality": 85,
    "security": 95
  }
}
```

**المؤشرات الخاصة**:
- عدد الموظفين النشطين
- دقة حساب الرواتب
- وقت معالجة الطلبات
- معدل رضا الموظفين
- الامتثال لقوانين العمل

### نظام إدارة المشاريع (Project Management)

**القيمة الأساسية**:
```json
{
  "name": "project-management",
  "displayName": "نظام إدارة المشاريع",
  "category": "core",
  "baseline": {
    "sizeKb": 38,
    "chars": 24000,
    "sections": 11,
    "subsections": 65,
    "tables": 17
  },
  "targets": {
    "contentQuality": 90,
    "performance": 85,
    "userExperience": 90,
    "codeQuality": 85,
    "security": 90
  }
}
```

**المؤشرات الخاصة**:
- عدد المشاريع النشطة
- نسبة المشاريع في الوقت المحدد
- معدل استخدام الموارد
- دقة التقديرات
- رضا العملاء

### نظام المخزون (Inventory System)

**القيمة الأساسية**:
```json
{
  "name": "inventory-system",
  "displayName": "نظام المخزون",
  "category": "core",
  "baseline": {
    "sizeKb": 33,
    "chars": 21000,
    "sections": 9,
    "subsections": 50,
    "tables": 16
  },
  "targets": {
    "contentQuality": 90,
    "performance": 90,
    "userExperience": 85,
    "codeQuality": 85,
    "security": 90
  }
}
```

**المؤشرات الخاصة**:
- عدد الأصناف
- دقة الجرد
- معدل دوران المخزون
- وقت معالجة الحركات
- نسبة العجز/الزيادة

---

## دليل التنفيذ

### المرحلة 1: الإعداد الأولي (الأسبوع 1-2)

#### الخطوة 1: إنشاء قاعدة البيانات

```sql
-- تنفيذ جميع جداول قاعدة البيانات
SOURCE /path/to/kpi-schema.sql;

-- إدخال البيانات الأساسية للأنظمة
INSERT INTO systems (name, display_name, category, baseline_size_kb, baseline_chars, baseline_sections)
VALUES
  ('maps-system', 'نظام الخرائط', 'core', 36, 23976, 10),
  ('accounting-system', 'نظام المحاسبة', 'core', 40, 25000, 12),
  ('hr-system', 'نظام الموارد البشرية', 'core', 35, 22000, 10),
  ('project-management', 'نظام إدارة المشاريع', 'core', 38, 24000, 11),
  ('inventory-system', 'نظام المخزون', 'core', 33, 21000, 9);
```

#### الخطوة 2: إعداد Backend

```bash
# إنشاء مجلد المشروع
mkdir semop-kpi-system
cd semop-kpi-system

# تهيئة مشروع Node.js
npm init -y

# تثبيت التبعيات
npm install express mysql2 node-cron axios pdfkit

# إنشاء هيكل المجلدات
mkdir -p src/{collectors,services,controllers,models,utils}
```

#### الخطوة 3: إعداد Frontend

```bash
# إضافة مكونات KPI إلى المشروع الحالي
cd /path/to/semop-frontend

# تثبيت مكتبات الرسوم البيانية
npm install ngx-charts d3

# إنشاء مكونات جديدة
ng generate module kpi --routing
ng generate component kpi/dashboard
ng generate component kpi/system-details
ng generate component kpi/reports
ng generate service kpi/kpi
```

### المرحلة 2: تطوير Collectors (الأسبوع 3-4)

#### تطوير Content Collector

```typescript
// src/collectors/content-collector.ts
// نسخ الكود من القسم السابق
```

#### تطوير Performance Collector

```typescript
// src/collectors/performance-collector.ts
// نسخ الكود من القسم السابق
```

#### تطوير System Health Collector

```typescript
// src/collectors/system-health-collector.ts
// نسخ الكود من القسم السابق
```

#### اختبار Collectors

```bash
# تشغيل اختبارات الوحدة
npm test

# اختبار يدوي
node src/collectors/test-collectors.js
```

### المرحلة 3: تطوير Backend APIs (الأسبوع 5-6)

#### إنشاء KPI Service

```typescript
// src/services/kpi-service.ts
export class KPIService {
  // تنفيذ جميع الدوال المطلوبة
}
```

#### إنشاء Controllers

```typescript
// src/controllers/kpi-controller.ts
export class KPIController {
  // تنفيذ جميع endpoints
}
```

#### اختبار APIs

```bash
# استخدام Postman أو curl
curl http://localhost:3000/api/kpi/systems
curl http://localhost:3000/api/kpi/metrics/1
```

### المرحلة 4: تطوير Frontend (الأسبوع 7-8)

#### تطوير Dashboard

```typescript
// كود Angular من القسم السابق
```

#### تطوير System Details

```typescript
// مكون تفاصيل النظام
```

#### تطوير Reports

```typescript
// مكون التقارير
```

### المرحلة 5: نظام التنبيهات (الأسبوع 9)

#### تطوير Alert Manager

```typescript
// src/services/alert-manager.ts
// نسخ الكود من القسم السابق
```

#### تكامل الإشعارات

```typescript
// تكامل مع Email, Slack, In-App
```

### المرحلة 6: Scheduler والأتمتة (الأسبوع 10)

#### إعداد Cron Jobs

```typescript
// src/scheduler/kpi-scheduler.ts
// نسخ الكود من القسم السابق
```

#### اختبار الأتمتة

```bash
# تشغيل scheduler
node src/scheduler/start.js

# مراقبة Logs
tail -f logs/kpi-scheduler.log
```

### المرحلة 7: التقارير (الأسبوع 11)

#### تطوير Report Generator

```typescript
// src/services/report-generator.ts
// نسخ الكود من القسم السابق
```

#### اختبار التقارير

```bash
# توليد تقرير تجريبي
node src/services/test-report-generator.js
```

### المرحلة 8: الاختبار والنشر (الأسبوع 12)

#### اختبار شامل

```bash
# اختبارات الوحدة
npm run test:unit

# اختبارات التكامل
npm run test:integration

# اختبارات E2E
npm run test:e2e
```

#### النشر على الإنتاج

```bash
# بناء Frontend
npm run build:prod

# نشر Backend
pm2 start src/index.js --name kpi-system

# نشر Scheduler
pm2 start src/scheduler/start.js --name kpi-scheduler
```

---

## الخلاصة

نظام مؤشرات الأداء الرئيسية (KPI) هو أداة قوية وشاملة لمراقبة وقياس جودة جميع مكونات SEMOP ERP. من خلال تطبيق هذا النظام، يمكن للفريق:

1. **الحصول على رؤية واضحة** لحالة كل نظام في أي وقت
2. **اكتشاف المشاكل مبكراً** قبل أن تؤثر على المستخدمين
3. **اتخاذ قرارات مبنية على بيانات** لتحسين الجودة
4. **قياس تأثير التحسينات** بشكل موضوعي
5. **ضمان الامتثال** للمعايير والأهداف المحددة

النظام مصمم ليكون **مرناً وقابلاً للتوسع**، مما يسمح بإضافة مؤشرات جديدة وأنظمة جديدة بسهولة. كما أنه **آلي بالكامل**، مما يقلل من الحاجة للتدخل اليدوي ويضمن الاستمرارية.

من خلال تطبيق منهجية SMART والمبادئ الأساسية للقياس، يضمن النظام أن جميع المؤشرات **ذات معنى وقابلة للتنفيذ**، وليست مجرد أرقام بدون قيمة.

---

**إعداد**: فريق تطوير SEMOP  
**التاريخ**: 2025-11-21  
**الإصدار**: 1.0  
**الحالة**: دليل شامل جاهز للتنفيذ

---

*"ما لا يمكن قياسه لا يمكن تحسينه"* - Peter Drucker
