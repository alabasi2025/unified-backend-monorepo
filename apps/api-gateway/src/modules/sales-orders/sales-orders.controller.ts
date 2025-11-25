'''
/**
 * @controller SalesOrdersController
 * @description
 * ## متحكم أوامر البيع (Sales Orders Controller)
 * هذا المتحكم مسؤول عن استقبال طلبات الـ API الخاصة بأوامر البيع وتوجيهها إلى الخدمة المناسبة.
 * ### Endpoints:
 * - `GET /` : جلب جميع أوامر البيع مع الفلترة.
 * - `GET /statistics` : جلب إحصائيات أوامر البيع.
 * - `GET /:id` : جلب أمر بيع محدد.
 * - `POST /` : إنشاء أمر بيع جديد.
 * - `PATCH /:id` : تحديث أمر بيع.
 * - `DELETE /:id` : حذف أمر بيع.
 * - `PATCH /:id/approve` : اعتماد أمر بيع.
 * - `PATCH /:id/cancel` : إلغاء أمر بيع.
 */

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { SalesOrdersService } from './sales-orders.service';
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto';

// TODO: Add AuthGuard once authentication is ready
// @UseGuards(AuthGuard)
@Controller('sales-orders')
export class SalesOrdersController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  /**
   * @endpoint GET /api/sales-orders
   * @description جلب قائمة أوامر البيع مع دعم الفلترة والترقيم.
   * @param filters - كائن يحتوي على شروط الفلترة.
   * @returns قائمة بأوامر البيع.
   */
  @Get()
  findAll(@Query() filters: any) {
    // TODO: استخراج holdingId من المستخدم المسجل
    const holdingId = 'test-holding-id';
    return this.salesOrdersService.findAll(holdingId, filters);
  }

  /**
   * @endpoint GET /api/sales-orders/statistics
   * @description جلب إحصائيات أوامر البيع.
   * @returns كائن يحتوي على الإحصائيات.
   */
  @Get('statistics')
  getStatistics(@Query('holdingId') holdingId: string) {
    // TODO: استخراج holdingId من المستخدم المسجل
    const finalHoldingId = holdingId || 'test-holding-id';
    return this.salesOrdersService.getStatistics(finalHoldingId);
  }

  /**
   * @endpoint GET /api/sales-orders/:id
   * @description جلب تفاصيل أمر بيع محدد.
   * @param id - معرف أمر البيع.
   * @returns كائن تفاصيل أمر البيع.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesOrdersService.findOne(id);
  }

  /**
   * @endpoint POST /api/sales-orders
   * @description إنشاء أمر بيع جديد.
   * @param createSalesOrderDto - بيانات أمر البيع الجديد.
   * @returns أمر البيع الذي تم إنشاؤه.
   */
  @Post()
  create(@Body() createSalesOrderDto: CreateSalesOrderDto, @Req() req: any) {
    // TODO: استخراج userId من المستخدم المسجل
    const userId = 'test-user-id';
    return this.salesOrdersService.create(createSalesOrderDto, userId);
  }

  /**
   * @endpoint PATCH /api/sales-orders/:id
   * @description تحديث بيانات أمر بيع.
   * @param id - معرف أمر البيع.
   * @param updateSalesOrderDto - البيانات الجديدة.
   * @returns أمر البيع بعد التحديث.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesOrderDto: UpdateSalesOrderDto, @Req() req: any) {
    // TODO: استخراج userId من المستخدم المسجل
    const userId = 'test-user-id';
    return this.salesOrdersService.update(id, updateSalesOrderDto, userId);
  }

  /**
   * @endpoint DELETE /api/sales-orders/:id
   * @description حذف أمر بيع (حذف ناعم).
   * @param id - معرف أمر البيع.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesOrdersService.remove(id);
  }

  /**
   * @endpoint PATCH /api/sales-orders/:id/approve
   * @description اعتماد أمر بيع.
   * @param id - معرف أمر البيع.
   * @returns أمر البيع بعد الاعتماد.
   */
  @Patch(':id/approve')
  approve(@Param('id') id: string, @Req() req: any) {
    // TODO: استخراج userId من المستخدم المسجل
    const userId = 'test-user-id';
    return this.salesOrdersService.approve(id, userId);
  }

  /**
   * @endpoint PATCH /api/sales-orders/:id/cancel
   * @description إلغاء أمر بيع.
   * @param id - معرف أمر البيع.
   * @param body - يحتوي على سبب الإلغاء.
   * @returns أمر البيع بعد الإلغاء.
   */
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Body() body: { reason: string }, @Req() req: any) {
    // TODO: استخراج userId من المستخدم المسجل
    const userId = 'test-user-id';
    return this.salesOrdersService.cancel(id, body.reason, userId);
  }
}
'''
