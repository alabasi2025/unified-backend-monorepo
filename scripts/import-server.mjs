import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Use environment variable or default
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://semop_user:semop_password@localhost:5432/semop_db';

const pool = new pg.Pool({ 
  connectionString: DATABASE_URL,
  ssl: false
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DOCS = [
  {
    slug: 'comprehensive-documentation',
    title: '📚 دفتر التوثيق الشامل لنظام SEMOP',
    file: 'COMPREHENSIVE_DOCUMENTATION.md',
    description: 'التوثيق الكامل والشامل - البنية المعمارية، قاعدة البيانات، Smart Notebook، نظام الخرائط، APIs، دليل المطورين، النشر والصيانة',
    category: 'DOCUMENTATION',
    type: 'GUIDE',
    version: '1.0.0',
  },
  {
    slug: 'documentation-summary',
    title: '📋 ملخص التوثيق التنفيذي',
    file: 'DOCUMENTATION_SUMMARY.md',
    description: 'ملخص تنفيذي سريع للتوثيق الشامل',
    category: 'DOCUMENTATION',
    type: 'DOCUMENTATION',
    version: '1.0.0',
  },
  {
    slug: 'maps-system-guide',
    title: '🗺️ دليل نظام الخرائط الشامل',
    file: 'maps-system-guide.md',
    description: 'دليل مفصل لنظام الخرائط الأوفلاين - البنية، الميزات، التكامل، والاستخدام',
    category: 'MAPS',
    type: 'GUIDE',
    version: '1.6.0',
  },
  {
    slug: 'prisma-migration-report',
    title: '🔧 تقرير Prisma 7 Migration',
    file: 'PRISMA_7_MIGRATION_REPORT.md',
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
      const content = readFileSync(doc.file, 'utf-8');

      const existing = await prisma.documentationPage.findUnique({
        where: { slug: doc.slug },
      });

      if (existing) {
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
        console.log(`✅ تم تحديث: ${doc.title}`);
      } else {
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
        console.log(`✅ تمت الإضافة: ${doc.title}`);
      }
    } catch (error) {
      console.error(`❌ خطأ في ${doc.title}:`, error.message);
    }
  }

  const total = await prisma.documentationPage.count();
  console.log(`\n✅ اكتمل! إجمالي الصفحات: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
