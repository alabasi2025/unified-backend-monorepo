import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentationService {
  private readonly docsPath = process.cwd(); // Current working directory

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get list of all available documentation files
   */
  async getAllDocuments() {
    return [
      {
        id: 'comprehensive-documentation',
        title: '📚 دفتر التوثيق الشامل لنظام SEMOP',
        slug: 'comprehensive-documentation',
        filename: 'docs/COMPREHENSIVE_DOCUMENTATION.md',
        description: 'التوثيق الكامل والشامل - البنية المعمارية، قاعدة البيانات، Smart Notebook، نظام الخرائط، APIs، دليل المطورين، النشر والصيانة',
        category: 'DEVELOPER',
        type: 'COMPREHENSIVE',
        icon: 'pi-book',
        version: '1.0.0',
        lastUpdated: '2025-11-22',
        pages: 144,
        sections: 62,
      },
      {
        id: 'documentation-summary',
        title: '📋 ملخص التوثيق التنفيذي',
        slug: 'documentation-summary',
        filename: 'docs/DOCUMENTATION_SUMMARY.md',
        description: 'ملخص تنفيذي سريع للتوثيق الشامل',
        category: 'DEVELOPER',
        type: 'SUMMARY',
        icon: 'pi-list',
        version: '1.0.0',
        lastUpdated: '2025-11-22',
        pages: 10,
        sections: 10,
      },
      {
        id: 'master-blueprint',
        title: 'دليل بناء النظام - SEMOP Master Blueprint',
        slug: 'master-blueprint',
        filename: 'SEMOP_MASTER_BLUEPRINT.md',
        description: 'المخطط الرئيسي للنظام - البنية المعمارية التفصيلية والأنظمة الفرعية',
        category: 'ARCHITECTURE',
        type: 'ARCHITECTURE',
        icon: 'pi-sitemap',
        version: '2.0.0',
        lastUpdated: '2025-11-21',
        pages: 30,
        sections: 11,
      },
      {
        id: 'maps-system-guide',
        title: '🗺️ دليل نظام الخرائط الشامل',
        slug: 'maps-system-guide',
        filename: 'docs/maps-system-guide.md',
        description: 'دليل مفصل لنظام الخرائط الأوفلاين - البنية، الميزات، التكامل، والاستخدام',
        category: 'ARCHITECTURE',
        type: 'SYSTEM_GUIDE',
        icon: 'pi-map',
        version: '1.6.0',
        lastUpdated: '2025-11-21',
        pages: 25,
        sections: 10,
      },
      {
        id: 'prisma-migration-report',
        title: '🔧 تقرير Prisma 7 Migration',
        slug: 'prisma-migration-report',
        filename: 'PRISMA_7_MIGRATION_REPORT.md',
        description: 'تقرير تقني: حل مشكلة Prisma 7 Driver Adapter في Smart Notebook',
        category: 'DEVELOPER',
        type: 'REPORT',
        icon: 'pi-wrench',
        version: '1.0.0',
        lastUpdated: '2025-11-22',
        pages: 5,
        sections: 5,
      },
    ];
  }

  /**
   * Get specific documentation file content
   */
  async getDocumentContent(filename: string): Promise<string> {
    const filePath = path.join(this.docsPath, filename);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error(`Document not found: ${filename}`);
    }
  }

  /**
   * Get SEMOP Master Blueprint
   */
  async getMasterBlueprint(): Promise<string> {
    return this.getDocumentContent('SEMOP_MASTER_BLUEPRINT.md');
  }

  /**
   * Get Maps System Guide
   */
  async getMapsSystemGuide(): Promise<string> {
    const filePath = path.join(this.docsPath, 'docs/maps-system-guide.md');
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error('Maps System Guide not found');
    }
  }

  /**
   * Import old documentation files into Reports Library
   */
  async importToReports() {
    const documents = [
      {
        title: '📚 دفتر التوثيق الشامل لنظام SEMOP',
        filename: 'docs/COMPREHENSIVE_DOCUMENTATION.md',
        summary: 'التوثيق الكامل والشامل - البنية المعمارية، قاعدة البيانات، Smart Notebook، نظام الخرائط، APIs، دليل المطورين، النشر والصيانة',
        type: 'DEVELOPER_GUIDE',
      },
      {
        title: '📋 ملخص التوثيق التنفيذي',
        filename: 'docs/DOCUMENTATION_SUMMARY.md',
        summary: 'ملخص تنفيذي سريع للتوثيق الشامل',
        type: 'EXECUTIVE_SUMMARY',
      },
      {
        title: 'دليل بناء النظام - SEMOP Master Blueprint',
        filename: 'SEMOP_MASTER_BLUEPRINT.md',
        summary: 'المخطط الرئيسي للنظام - البنية المعمارية التفصيلية والأنظمة الفرعية',
        type: 'ARCHITECTURE',
      },
      {
        title: '🗺️ دليل نظام الخرائط الشامل',
        filename: 'docs/maps-system-guide.md',
        summary: 'دليل مفصل لنظام الخرائط الأوفلاين - البنية، الميزات، التكامل، والاستخدام',
        type: 'USER_GUIDE',
      },
      {
        title: '🔧 تقرير Prisma 7 Migration',
        filename: 'PRISMA_7_MIGRATION_REPORT.md',
        summary: 'تقرير تقني: حل مشكلة Prisma 7 Driver Adapter في Smart Notebook',
        type: 'TECHNICAL_REPORT',
      },
    ];

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const doc of documents) {
      try {
        // Read file content
        const content = await this.getDocumentContent(doc.filename);

        // Check if document already exists
        const existing = await this.prisma.report.findFirst({
          where: { title: doc.title },
        });

        if (existing) {
          // Update existing document
          await this.prisma.report.update({
            where: { id: existing.id },
            data: {
              content,
              summary: doc.summary,
              type: doc.type as any,
              format: 'MARKDOWN',
              status: 'PUBLISHED',
              updatedAt: new Date(),
            },
          });
        } else {
          // Create new document
          await this.prisma.report.create({
            data: {
              title: doc.title,
              content,
              summary: doc.summary,
              type: doc.type as any,
              format: 'MARKDOWN',
              status: 'PUBLISHED',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }

        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          title: doc.title,
          error: error.message,
        });
      }
    }

    return {
      successCount,
      errorCount,
      total: documents.length,
      errors,
    };
  }
}