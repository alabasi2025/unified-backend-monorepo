// /home/ubuntu/search-module/search.controller.ts
// Controller لتوفير واجهات برمجة التطبيقات (APIs) للبحث المتقدم

import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto-create';
import { SearchResponseDto } from './dto-response';

// نفترض وجود Guard للمصادقة
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Search') // وسم Swagger
@Controller('search')
// نفترض أن جميع APIs تتطلب مصادقة
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * @method advancedSearch
   * @description واجهة برمجة تطبيقات (API) للبحث المتقدم في النظام.
   * @param {CreateSearchDto} createSearchDto - معايير البحث.
   * @param {Request} req - كائن الطلب للحصول على معلومات المستخدم.
   * @returns {Promise<SearchResponseDto>} - نتائج البحث.
   */
  @Post('advanced')
  @HttpCode(HttpStatus.OK) // استخدام POST ولكن مع رمز حالة 200 OK لأنه عملية استعلام
  @ApiOperation({ summary: 'البحث المتقدم', description: 'إجراء بحث شامل ومتقدم عبر جميع عناصر النظام.' })
  @ApiResponse({ status: 200, description: 'تمت عملية البحث بنجاح', type: SearchResponseDto })
  @ApiResponse({ status: 400, description: 'بيانات طلب غير صالحة' })
  @ApiResponse({ status: 401, description: 'غير مصرح به' })
  async advancedSearch(@Body() createSearchDto: CreateSearchDto, @Req() req: any): Promise<SearchResponseDto> {
    // نفترض أن معرف المستخدم موجود في كائن الطلب (req.user.id)
    const userId = req.user?.id || 'mock-user-id'; // استخدام معرف وهمي للمحاكاة

    // 1. تسجيل عملية البحث (يمكن أن تتم بشكل غير متزامن)
    await this.searchService.logSearch(createSearchDto, userId);

    // 2. تنفيذ البحث الفعلي
    return this.searchService.advancedSearch(createSearchDto, userId);
  }

  /**
   * @method getSearchHistory
   * @description واجهة برمجة تطبيقات (API) للحصول على سجل البحث للمستخدم.
   * @param {Request} req - كائن الطلب للحصول على معلومات المستخدم.
   * @returns {Promise<any>} - سجل البحث.
   */
  // @Get('history')
  // @ApiOperation({ summary: 'سجل البحث', description: 'الحصول على سجل عمليات البحث السابقة للمستخدم.' })
  // @ApiResponse({ status: 200, description: 'تم الحصول على السجل بنجاح' })
  // async getSearchHistory(@Req() req: any): Promise<any> {
  //   const userId = req.user?.id || 'mock-user-id';
  //   // منطق الحصول على سجل البحث من قاعدة البيانات
  //   // return this.searchService.getHistory(userId);
  //   return { history: [] }; // محاكاة
  // }
}
