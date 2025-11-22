#!/usr/bin/env python3
import psycopg2
import sys

# Database connection
conn = psycopg2.connect(
    host="localhost",
    database="semop_db",
    user="postgres"
)
cur = conn.cursor()

docs = [
    {
        'slug': 'comprehensive-documentation',
        'title': '📚 دفتر التوثيق الشامل لنظام SEMOP',
        'file': '/var/www/semop/backend/COMPREHENSIVE_DOCUMENTATION.md',
        'summary': 'التوثيق الكامل والشامل - البنية المعمارية، قاعدة البيانات، Smart Notebook، نظام الخرائط، APIs، دليل المطورين، النشر والصيانة',
        'category': 'DOCUMENTATION',
        'type': 'GUIDE',
        'version': '1.0.0',
    },
    {
        'slug': 'documentation-summary',
        'title': '📋 ملخص التوثيق التنفيذي',
        'file': '/var/www/semop/backend/DOCUMENTATION_SUMMARY.md',
        'summary': 'ملخص تنفيذي سريع للتوثيق الشامل',
        'category': 'DOCUMENTATION',
        'type': 'DOCUMENTATION',
        'version': '1.0.0',
    },
    {
        'slug': 'maps-system-guide',
        'title': '🗺️ دليل نظام الخرائط الشامل',
        'file': '/var/www/semop/backend/maps-system-guide.md',
        'summary': 'دليل مفصل لنظام الخرائط الأوفلاين - البنية، الميزات، التكامل، والاستخدام',
        'category': 'MAPS',
        'type': 'GUIDE',
        'version': '1.6.0',
    },
    {
        'slug': 'prisma-migration-report',
        'title': '🔧 تقرير Prisma 7 Migration',
        'file': '/var/www/semop/backend/PRISMA_7_MIGRATION_REPORT.md',
        'summary': 'تقرير تقني: حل مشكلة Prisma 7 Driver Adapter في Smart Notebook',
        'category': 'TECHNICAL',
        'type': 'REPORT',
        'version': '1.0.0',
    },
]

print('🚀 بدء استيراد الوثائق...\n')

for doc in docs:
    try:
        with open(doc['file'], 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if exists
        cur.execute('SELECT id FROM "DocumentationPage" WHERE slug = %s', (doc['slug'],))
        existing = cur.fetchone()
        
        if existing:
            cur.execute('''
                UPDATE "DocumentationPage" 
                SET title = %s, content = %s, summary = %s, type = %s, 
                    category = %s, version = %s, "isPublished" = true, 
                    status = 'PUBLISHED', "updatedBy" = 'system', 
                    "updatedAt" = CURRENT_TIMESTAMP
                WHERE slug = %s
            ''', (doc['title'], content, doc['summary'], doc['type'], 
                  doc['category'], doc['version'], doc['slug']))
            print(f"✅ تم تحديث: {doc['title']}")
        else:
            cur.execute('''
                INSERT INTO "DocumentationPage" 
                (slug, title, content, summary, type, category, version, 
                 "isPublished", status, "createdBy", tags)
                VALUES (%s, %s, %s, %s, %s, %s, %s, true, 'PUBLISHED', 'system', ARRAY[]::text[])
            ''', (doc['slug'], doc['title'], content, doc['summary'], 
                  doc['type'], doc['category'], doc['version']))
            print(f"✅ تمت الإضافة: {doc['title']}")
        
        conn.commit()
    except Exception as e:
        print(f"❌ خطأ في {doc['title']}: {e}")
        conn.rollback()

cur.execute('SELECT COUNT(*) FROM "DocumentationPage"')
total = cur.fetchone()[0]
print(f"\n✅ اكتمل! إجمالي الصفحات: {total}")

cur.close()
conn.close()
