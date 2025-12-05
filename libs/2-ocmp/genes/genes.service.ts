// PHASE-14: تحسين جودة DTOs - إضافة تعليقات PHASE للتوثيق
// /home/ubuntu/review_workspace/unified-backend-monorepo/src/genes/genes.service.ts
import { Gene, GeneCreationRequest, ServiceResponse } from '../../../../../shared-contracts-repo/src/genes/genes.dto';

/**
 * @class GenesService
 * @description خدمة لإدارة عمليات الجينات (Genes) الأساسية.
 * تضمن هذه الخدمة الالتزام بأعلى معايير الأمان والنوعية (Type Safety)
 * ومعالجة الأخطاء بشكل فعال.
 */
export class GenesService {
  private genes: Gene[] = [];

  /**
   * @method createGene
   * @description ينشئ جينًا جديدًا بناءً على بيانات الطلب.
   * يتضمن التحقق من صحة المدخلات ومعالجة الأخطاء بشكل منظم.
   *
   * @param {GeneCreationRequest} request - بيانات طلب إنشاء الجين.
   * @returns {Promise<ServiceResponse<Gene>>} - استجابة الخدمة التي تحتوي على الجين المنشأ أو رسالة خطأ.
   */
  async createGene(request: GeneCreationRequest): Promise<ServiceResponse<Gene>> {
    try {
      // 1. التحقق من صحة المدخلات (Input Validation)
      if (!request.name || request.name.trim() === '') {
        return {
          success: false,
          data: null,
          error: 'Gene name is required and cannot be empty.',
        };
      }

      if (!request.description || request.description.trim() === '') {
        return {
          success: false,
          data: null,
          error: 'Gene description is required and cannot be empty.',
        };
      }

      // 2. إنشاء الكيان الجديد مع الالتزام التام بالنوع (Type Safety) ودون type assertions
      const newGene: Gene = {
        id: (this.genes.length + 1).toString(),
        name: request.name.trim(),
        description: request.description.trim(),
        isActive: true,
      };

      this.genes.push(newGene);

      // 3. إرجاع استجابة نجاح منظمة
      return {
        success: true,
        data: newGene,
        error: null,
      };

    } catch (e) {
      // 4. معالجة الأخطاء العامة (Enhanced Error Handling)
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during gene creation.';
      console.error('Error in createGene:', e);

      return {
        success: false,
        data: null,
        error: `Failed to create gene: ${errorMessage}`,
      };
    }
  }

  /**
   * @method getGeneById
   * @description يسترجع جينًا بناءً على معرفه الفريد.
   *
   * @param {string} id - المعرف الفريد للجين.
   * @returns {Promise<ServiceResponse<Gene>>} - استجابة الخدمة التي تحتوي على الجين أو رسالة خطأ.
   */
  async getGeneById(id: string): Promise<ServiceResponse<Gene>> {
    // التحقق من صحة المعرف
    if (!id || id.trim() === '') {
      return {
        success: false,
        data: null,
        error: 'Gene ID is required and cannot be empty.',
      };
    }

    const gene = this.genes.find(g => g.id === id);

    if (!gene) {
      return {
        success: false,
        data: null,
        error: `Gene with ID ${id} not found.`,
      };
    }

    return {
      success: true,
      data: gene,
      error: null,
    };
  }
}
