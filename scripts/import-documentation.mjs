import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL غير موجود في .env');
  process.exit(1);
}

// Create Prisma Client with Driver Adapter (Prisma 7)
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DOCS = [
  {
    slug: 'comprehensive-documentation',
    title: '📚 دفتر التوثيق الشامل لنظام SEMOP',
    filename: '../docs/COMPREHENSIVE_DOCUMENTATION.md',
    description: 'التوثيق الكامل والشامل - البنية المعمارية، قاعدة البيانات، Smart Notebook، نظام الخرائط، APIs، دليل المطورين، النشر والصيانة',
    category: 'DOCUMENTATION',
    type: 'GUIDE',
    version: '1.0.0',
  },
  {
    slug: 'documentation-summary',
    title: '📋 ملخص التوثيق التنفيذي',
    filename: '../docs/DOCUMENTATION_SUMMARY.md',
    description: 'ملخص تنفيذي سريع للتوثيق الشامل',
    category: 'DOCUMENTATION',
    type: 'DOCUMENTATION',
    version: '1.0.0',
  },
  {
    slug: 'maps-system-guide',
    title: '🗺️ دليل نظام الخرائط الشامل',
    filename: '../docs/maps-system-guide.md',
    description: 'دليل مفصل لنظام الخرائط الأوفلاين - البنية، الميزات، التكامل، والاستخدام',
    category: 'MAPS',
    type: 'GUIDE',
    version: '1.6.0',
  },
  {
    slug: 'prisma-migration-report',
    title: '🔧 تقرير Prisma 7 Migration',
    filename: '../PRISMA_7_MIGRATION_REPORT.md',
    description: 'تقرير تقني: حل مشكلة Prisma 7 Driver Adapter في Smart Notebook',
    category: 'TECHNICAL',
    type: 'REPORT',
    version: '1.0.0',
  },
];

async function main() {
  console.log('🚀 بدء استيراد الوثائق...\n');

  for (const doc of DOCS) {
    try {
      const filePath = join(__dirname, doc.filename);
      const content = readFileSync(filePath, 'utf-8');

      // Check if already exists
      const existing = await prisma.documentationPage.findUnique({
        where: { slug: doc.slug },
      });

      if (existing) {
        console.log(`⚠️  ${doc.title} موجود بالفعل - تحديث...`);
        await prisma.documentationPage.update({
          where: { slug: doc.slug },
          data: {
            title: doc.title,
            content,
            summary: doc.description,
            type: doc.type,
            category: doc.category,
            version: doc.version,
            isPublished: true,
            status: 'PUBLISHED',
            updatedBy: 'system',
          },
        });
        console.log(`✅ تم تحديث: ${doc.title}\n`);
      } else {
        console.log(`➕ إضافة: ${doc.title}...`);
        await prisma.documentationPage.create({
          data: {
            slug: doc.slug,
            title: doc.title,
            content,
            summary: doc.description,
            type: doc.type,
            category: doc.category,
            version: doc.version,
            isPublished: true,
            status: 'PUBLISHED',
            createdBy: 'system',
            tags: [],
          },
        });
        console.log(`✅ تمت الإضافة: ${doc.title}\n`);
      }
    } catch (error) {
      console.error(`❌ خطأ في ${doc.title}:`, error.message);
    }
  }

  // Statistics
  const stats = await prisma.documentationPage.groupBy({
    by: ['type', 'category'],
    _count: true,
  });

  console.log('\n📊 الإحصائيات:');
  console.log('═'.repeat(50));
  stats.forEach((stat) => {
    console.log(`${stat.type} - ${stat.category}: ${stat._count} صفحة`);
  });

  const total = await prisma.documentationPage.count();
  console.log('═'.repeat(50));
  console.log(`إجمالي الصفحات: ${total}`);
  console.log('\n✅ اكتمل الاستيراد!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
