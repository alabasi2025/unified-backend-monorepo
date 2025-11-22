#!/usr/bin/env node

/**
 * Script to import existing documentation files into the new Reports Library
 * This will migrate all 5 documents from the old documentation system
 */

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

// Document definitions from old system
const documents = [
  {
    title: '📚 دفتر التوثيق الشامل لنظام SEMOP',
    filename: 'docs/COMPREHENSIVE_DOCUMENTATION.md',
    summary: 'التوثيق الكامل والشامل - البنية المعمارية، قاعدة البيانات، Smart Notebook، نظام الخرائط، APIs، دليل المطورين، النشر والصيانة',
    type: 'DEVELOPER_GUIDE',
    category: 'DEVELOPER',
  },
  {
    title: '📋 ملخص التوثيق التنفيذي',
    filename: 'docs/DOCUMENTATION_SUMMARY.md',
    summary: 'ملخص تنفيذي سريع للتوثيق الشامل',
    type: 'EXECUTIVE_SUMMARY',
    category: 'DEVELOPER',
  },
  {
    title: 'دليل بناء النظام - SEMOP Master Blueprint',
    filename: 'SEMOP_MASTER_BLUEPRINT.md',
    summary: 'المخطط الرئيسي للنظام - البنية المعمارية التفصيلية والأنظمة الفرعية',
    type: 'ARCHITECTURE',
    category: 'ARCHITECTURE',
  },
  {
    title: '🗺️ دليل نظام الخرائط الشامل',
    filename: 'docs/maps-system-guide.md',
    summary: 'دليل مفصل لنظام الخرائط الأوفلاين - البنية، الميزات، التكامل، والاستخدام',
    type: 'USER_GUIDE',
    category: 'ARCHITECTURE',
  },
  {
    title: '🔧 تقرير Prisma 7 Migration',
    filename: 'PRISMA_7_MIGRATION_REPORT.md',
    summary: 'تقرير تقني: حل مشكلة Prisma 7 Driver Adapter في Smart Notebook',
    type: 'TECHNICAL_REPORT',
    category: 'DEVELOPER',
  },
];

async function importDocuments() {
  console.log('🚀 Starting documentation import...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const doc of documents) {
    try {
      console.log(`📄 Processing: ${doc.title}`);
      
      // Read file content
      const filePath = path.join(__dirname, '..', doc.filename);
      console.log(`   Reading from: ${filePath}`);
      
      let content;
      try {
        content = await fs.readFile(filePath, 'utf-8');
        console.log(`   ✓ File read successfully (${content.length} characters)`);
      } catch (error) {
        console.error(`   ✗ Error reading file: ${error.message}`);
        errorCount++;
        continue;
      }

      // Check if document already exists
      const existing = await prisma.report.findFirst({
        where: {
          title: doc.title,
        },
      });

      if (existing) {
        console.log(`   ⚠ Document already exists, updating...`);
        await prisma.report.update({
          where: { id: existing.id },
          data: {
            content,
            summary: doc.summary,
            type: doc.type,
            format: 'MARKDOWN',
            status: 'PUBLISHED',
            updatedAt: new Date(),
          },
        });
        console.log(`   ✓ Updated successfully\n`);
      } else {
        console.log(`   Creating new report...`);
        await prisma.report.create({
          data: {
            title: doc.title,
            content,
            summary: doc.summary,
            type: doc.type,
            format: 'MARKDOWN',
            status: 'PUBLISHED',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log(`   ✓ Created successfully\n`);
      }

      successCount++;
    } catch (error) {
      console.error(`   ✗ Error processing document: ${error.message}\n`);
      errorCount++;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✓ Success: ${successCount}`);
  console.log(`   ✗ Errors: ${errorCount}`);
  console.log(`   Total: ${documents.length}`);
}

async function main() {
  try {
    await importDocuments();
    console.log('\n✅ Import completed successfully!');
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
