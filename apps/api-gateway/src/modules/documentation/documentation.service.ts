import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentationService {
  private readonly docsPath = path.join(process.cwd(), '../../');

  /**
   * Get list of all available documentation files
   */
  async getAllDocuments() {
    return [
      {
        id: 'master-blueprint',
        title: 'دليل بناء النظام الشامل',
        filename: 'SEMOP_MASTER_BLUEPRINT.md',
        description: 'المخطط الرئيسي لنظام SEMOP - البنية المعمارية والأنظمة الفرعية',
        category: 'developer',
        icon: 'pi-sitemap',
        version: '2.0.0',
        lastUpdated: '2025-11-21',
        pages: 30,
        sections: 11,
      },
      {
        id: 'maps-system-guide',
        title: '🗺️ دليل نظام الخرائط الشامل',
        filename: 'maps-system-guide.md',
        description: 'دليل مفصل لنظام الخرائط الأوفلاين - البنية والميزات والتكامل',
        category: 'architecture',
        icon: 'pi-map',
        version: '1.6.0',
        lastUpdated: '2025-11-21',
        pages: 25,
        sections: 10,
      },
      {
        id: 'user-guide',
        title: 'دليل المستخدم',
        filename: 'USER_GUIDE.md',
        description: 'دليل شامل لاستخدام النظام',
        category: 'user',
        icon: 'pi-user',
        version: '1.0.0',
      },
      {
        id: 'api-reference',
        title: 'مرجع API',
        filename: 'API_REFERENCE.md',
        description: 'توثيق كامل لجميع APIs',
        category: 'developer',
        icon: 'pi-code',
        version: '1.0.0',
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
    const filePath = '/unified-frontend-monorepo/docs/maps-system-guide.md';
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error('Maps System Guide not found');
    }
  }
}
