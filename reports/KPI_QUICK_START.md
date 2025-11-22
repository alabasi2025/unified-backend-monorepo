# 🚀 دليل البدء السريع - نظام KPI

**الهدف**: تطبيق نظام KPI على نظام الخرائط في 30 دقيقة

---

## الخطوة 1: إعداد قاعدة البيانات (5 دقائق)

```sql
-- الاتصال بقاعدة البيانات
mysql -u root -p

-- إنشاء الجداول
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

CREATE TABLE kpi_metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  system_id INT NOT NULL,
  metric_type ENUM('content', 'performance', 'ux', 'code', 'security') NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10, 2) NOT NULL,
  metric_unit VARCHAR(50),
  baseline_value DECIMAL(10, 2),
  score DECIMAL(5, 2),
  status ENUM('excellent', 'good', 'acceptable', 'poor') NOT NULL,
  measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (system_id) REFERENCES systems(id),
  INDEX idx_system_metric (system_id, metric_type, measured_at)
);

-- إدخال نظام الخرائط
INSERT INTO systems (name, display_name, category, baseline_size_kb, baseline_chars, baseline_sections)
VALUES ('maps-system', 'نظام الخرائط', 'core', 36, 23976, 10);
```

---

## الخطوة 2: إنشاء Content Collector (10 دقائق)

```typescript
// kpi-collector.ts
import * as fs from 'fs';
import * as mysql from 'mysql2/promise';

interface ContentMetrics {
  sizeKb: number;
  chars: number;
  sections: number;
}

async function collectMetrics(filePath: string): Promise<ContentMetrics> {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const stats = await fs.promises.stat(filePath);
  
  return {
    sizeKb: Math.round(stats.size / 1024),
    chars: content.length,
    sections: (content.match(/^#{1,6}\s/gm) || []).length,
  };
}

function calculateScore(metrics: ContentMetrics, baseline: ContentMetrics): number {
  const sizeScore = (metrics.sizeKb / baseline.sizeKb) * 100;
  const charsScore = (metrics.chars / baseline.chars) * 100;
  const sectionsScore = (metrics.sections / baseline.sections) * 100;
  
  return Math.round((sizeScore + charsScore + sectionsScore) / 3);
}

function getStatus(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'acceptable';
  return 'poor';
}

async function saveMetric(connection: mysql.Connection, data: any) {
  await connection.execute(
    `INSERT INTO kpi_metrics 
    (system_id, metric_type, metric_name, metric_value, metric_unit, baseline_value, score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.systemId,
      data.metricType,
      data.metricName,
      data.metricValue,
      data.metricUnit,
      data.baselineValue,
      data.score,
      data.status,
    ]
  );
}

async function main() {
  // الاتصال بقاعدة البيانات
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'semop',
  });
  
  try {
    // جمع المؤشرات
    const filePath = '/unified-frontend-monorepo/docs/maps-system-guide.md';
    const metrics = await collectMetrics(filePath);
    
    // القيمة الأساسية
    const baseline = {
      sizeKb: 36,
      chars: 23976,
      sections: 10,
    };
    
    // حساب النتيجة
    const score = calculateScore(metrics, baseline);
    const status = getStatus(score);
    
    // حفظ المؤشرات
    await saveMetric(connection, {
      systemId: 1,
      metricType: 'content',
      metricName: 'content_size',
      metricValue: metrics.sizeKb,
      metricUnit: 'KB',
      baselineValue: baseline.sizeKb,
      score,
      status,
    });
    
    await saveMetric(connection, {
      systemId: 1,
      metricType: 'content',
      metricName: 'content_chars',
      metricValue: metrics.chars,
      metricUnit: 'chars',
      baselineValue: baseline.chars,
      score,
      status,
    });
    
    console.log('✅ تم جمع المؤشرات بنجاح!');
    console.log(`النتيجة: ${score}/100 (${status})`);
    console.log(`الحجم: ${metrics.sizeKb} KB`);
    console.log(`الأحرف: ${metrics.chars}`);
    console.log(`الأقسام: ${metrics.sections}`);
    
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
```

**تشغيل**:
```bash
npm install mysql2
npx ts-node kpi-collector.ts
```

---

## الخطوة 3: إنشاء API بسيط (10 دقائق)

```typescript
// kpi-api.ts
import express from 'express';
import * as mysql from 'mysql2/promise';

const app = express();
const port = 3001;

// إنشاء pool للاتصال بقاعدة البيانات
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'semop',
  waitForConnections: true,
  connectionLimit: 10,
});

// GET /api/kpi/systems
app.get('/api/kpi/systems', async (req, res) => {
  try {
    const [systems] = await pool.execute('SELECT * FROM systems');
    res.json({ success: true, data: systems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/kpi/metrics/:systemId
app.get('/api/kpi/metrics/:systemId', async (req, res) => {
  try {
    const { systemId } = req.params;
    const [metrics] = await pool.execute(
      'SELECT * FROM kpi_metrics WHERE system_id = ? ORDER BY measured_at DESC LIMIT 10',
      [systemId]
    );
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/kpi/dashboard
app.get('/api/kpi/dashboard', async (req, res) => {
  try {
    // الحصول على آخر مؤشرات لكل نظام
    const [metrics] = await pool.execute(`
      SELECT 
        s.id,
        s.name,
        s.display_name,
        AVG(m.score) as avg_score,
        COUNT(CASE WHEN m.status = 'poor' THEN 1 END) as poor_count
      FROM systems s
      LEFT JOIN kpi_metrics m ON s.id = m.system_id
      WHERE m.measured_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY s.id, s.name, s.display_name
    `);
    
    const overallScore = metrics.reduce((sum, m) => sum + m.avg_score, 0) / metrics.length;
    
    res.json({
      success: true,
      data: {
        overallScore: Math.round(overallScore),
        systemsCount: metrics.length,
        systems: metrics,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 KPI API يعمل على http://localhost:${port}`);
});
```

**تشغيل**:
```bash
npm install express mysql2
npx ts-node kpi-api.ts
```

**اختبار**:
```bash
curl http://localhost:3001/api/kpi/systems
curl http://localhost:3001/api/kpi/metrics/1
curl http://localhost:3001/api/kpi/dashboard
```

---

## الخطوة 4: إنشاء Dashboard بسيط (5 دقائق)

```html
<!-- kpi-dashboard.html -->
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>لوحة تحكم KPI</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }
    
    .score-card {
      background: white;
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    
    .score-value {
      font-size: 72px;
      font-weight: bold;
      margin: 20px 0;
    }
    
    .score-label {
      font-size: 18px;
      color: #666;
    }
    
    .systems-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .system-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .system-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .system-score {
      font-size: 36px;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .excellent { color: #10b981; }
    .good { color: #3b82f6; }
    .acceptable { color: #f59e0b; }
    .poor { color: #ef4444; }
    
    .metrics-table {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 12px;
      text-align: right;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background: #f9fafb;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 لوحة تحكم مؤشرات الأداء - SEMOP</h1>
    
    <div class="score-card">
      <div class="score-label">النتيجة الإجمالية</div>
      <div class="score-value" id="overallScore">--</div>
      <div class="score-label" id="overallStatus">جاري التحميل...</div>
    </div>
    
    <div class="systems-grid" id="systemsGrid">
      <!-- سيتم ملؤها ديناميكياً -->
    </div>
    
    <div class="metrics-table">
      <h2>آخر المؤشرات</h2>
      <table id="metricsTable">
        <thead>
          <tr>
            <th>النظام</th>
            <th>المؤشر</th>
            <th>القيمة</th>
            <th>النتيجة</th>
            <th>الحالة</th>
            <th>الوقت</th>
          </tr>
        </thead>
        <tbody>
          <!-- سيتم ملؤها ديناميكياً -->
        </tbody>
      </table>
    </div>
  </div>
  
  <script>
    async function loadDashboard() {
      try {
        // تحميل بيانات Dashboard
        const response = await fetch('http://localhost:3001/api/kpi/dashboard');
        const result = await response.json();
        
        if (result.success) {
          const { overallScore, systems } = result.data;
          
          // عرض النتيجة الإجمالية
          document.getElementById('overallScore').textContent = overallScore;
          document.getElementById('overallScore').className = 'score-value ' + getStatusClass(overallScore);
          document.getElementById('overallStatus').textContent = getStatusLabel(overallScore);
          
          // عرض الأنظمة
          const systemsGrid = document.getElementById('systemsGrid');
          systemsGrid.innerHTML = systems.map(system => `
            <div class="system-card">
              <div class="system-name">${system.display_name}</div>
              <div class="system-score ${getStatusClass(system.avg_score)}">
                ${Math.round(system.avg_score)}
              </div>
              <div class="score-label">${getStatusLabel(system.avg_score)}</div>
            </div>
          `).join('');
          
          // تحميل المؤشرات
          await loadMetrics();
        }
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
      }
    }
    
    async function loadMetrics() {
      try {
        const response = await fetch('http://localhost:3001/api/kpi/metrics/1');
        const result = await response.json();
        
        if (result.success) {
          const tbody = document.querySelector('#metricsTable tbody');
          tbody.innerHTML = result.data.map(metric => `
            <tr>
              <td>نظام الخرائط</td>
              <td>${metric.metric_name}</td>
              <td>${metric.metric_value} ${metric.metric_unit || ''}</td>
              <td class="${getStatusClass(metric.score)}">${metric.score}</td>
              <td class="${getStatusClass(metric.score)}">${getStatusLabel(metric.score)}</td>
              <td>${new Date(metric.measured_at).toLocaleString('ar')}</td>
            </tr>
          `).join('');
        }
      } catch (error) {
        console.error('خطأ في تحميل المؤشرات:', error);
      }
    }
    
    function getStatusClass(score) {
      if (score >= 90) return 'excellent';
      if (score >= 70) return 'good';
      if (score >= 50) return 'acceptable';
      return 'poor';
    }
    
    function getStatusLabel(score) {
      if (score >= 90) return 'ممتاز';
      if (score >= 70) return 'جيد';
      if (score >= 50) return 'مقبول';
      return 'ضعيف';
    }
    
    // تحميل البيانات عند فتح الصفحة
    loadDashboard();
    
    // تحديث تلقائي كل 30 ثانية
    setInterval(loadDashboard, 30000);
  </script>
</body>
</html>
```

**فتح Dashboard**:
```bash
# افتح الملف في المتصفح
open kpi-dashboard.html
# أو
firefox kpi-dashboard.html
```

---

## النتيجة النهائية

بعد 30 دقيقة، لديك الآن:

✅ **قاعدة بيانات KPI** جاهزة  
✅ **Collector** يجمع مؤشرات المحتوى  
✅ **API** يوفر البيانات  
✅ **Dashboard** يعرض النتائج

---

## الخطوات التالية

### 1. أتمتة الجمع (Automation)

```typescript
// kpi-scheduler.ts
import cron from 'node-cron';

// جمع المؤشرات كل 6 ساعات
cron.schedule('0 */6 * * *', async () => {
  console.log('جمع المؤشرات...');
  // استدعاء kpi-collector.ts
});
```

### 2. إضافة مؤشرات الأداء

```typescript
// performance-collector.ts
async function collectPerformanceMetrics() {
  const startTime = Date.now();
  const response = await fetch('http://localhost/api/documentation/maps/system-guide');
  const endTime = Date.now();
  
  return {
    responseTime: endTime - startTime,
    statusCode: response.status,
  };
}
```

### 3. إضافة التنبيهات

```typescript
// alert-checker.ts
async function checkAlerts(metrics) {
  if (metrics.score < 50) {
    // إرسال تنبيه
    console.log('⚠️ تنبيه: النتيجة منخفضة!');
  }
}
```

### 4. إضافة التقارير

```typescript
// report-generator.ts
async function generateDailyReport() {
  const metrics = await getMetrics();
  // توليد تقرير PDF
}
```

---

## الموارد

- **الدليل الشامل**: `/home/ubuntu/SEMOP_KPI_SYSTEM_GUIDE.md`
- **الكود الكامل**: متوفر في الدليل الشامل
- **الدعم**: راجع الدليل الشامل للتفاصيل

---

**تهانينا! 🎉**  
لديك الآن نظام KPI أساسي يعمل!

الآن يمكنك:
1. مراقبة جودة المحتوى بشكل مستمر
2. رؤية النتائج في Dashboard
3. تتبع التحسينات عبر الزمن
4. توسيع النظام ليشمل جميع الأنظمة

---

*"ابدأ صغيراً، وسّع تدريجياً"* 🚀
