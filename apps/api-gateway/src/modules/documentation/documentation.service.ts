import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentationService {
  private readonly docsPath = process.cwd(); // Current working directory

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
}
