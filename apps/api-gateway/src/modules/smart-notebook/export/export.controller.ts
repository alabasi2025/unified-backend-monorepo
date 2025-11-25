import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExportService } from './export.service';
import { CreateExportJobDto } from './dto/dto-create';
import { ExportJobResponseDto } from './dto/dto-response';

// افتراض وجود Guard للتحقق من المصادقة واستخراج معرف المستخدم
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * وحدة التحكم (Controller) لمهام التصدير.
 * توفر واجهات RESTful APIs لإنشاء ومتابعة وحذف مهام التصدير.
 */
@ApiTags('Export Jobs - مهام التصدير')
@ApiBearerAuth() // للإشارة إلى أن هذه الواجهات تتطلب مصادقة
@Controller('exports')
// @UseGuards(JwtAuthGuard) // تفعيل الحماية على جميع الواجهات
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  /**
   * إنشاء مهمة تصدير جديدة.
   * @param req طلب HTTP (لاستخراج معرف المستخدم).
   * @param createExportJobDto بيانات إنشاء المهمة.
   * @returns مهمة التصدير التي تم إنشاؤها.
   */
  @Post()
  @HttpCode(HttpStatus.ACCEPTED) // استخدام 202 Accepted لأن العملية غير متزامنة
  @ApiOperation({ summary: 'إنشاء مهمة تصدير جديدة لدفتر أو ملاحظة' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'تم قبول طلب التصدير وبدء المعالجة.',
    type: ExportJobResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'بيانات الطلب غير صالحة.',
  })
  async create(
    @Req() req: any, // يجب استبدالها بـ @UserId() أو ما شابه في تطبيق حقيقي
    @Body() createExportJobDto: CreateExportJobDto,
  ): Promise<ExportJobResponseDto> {
    // افتراض أن معرف المستخدم يتم استخراجه من الـ Token
    const userId = req.user?.id || 'mock-user-id-123'; // استخدام معرف وهمي للمحاكاة

    return this.exportService.createExportJob(userId, createExportJobDto);
  }

  /**
   * الحصول على جميع مهام التصدير الخاصة بالمستخدم.
   * @param req طلب HTTP (لاستخراج معرف المستخدم).
   * @returns قائمة بمهام التصدير.
   */
  @Get()
  @ApiOperation({ summary: 'الحصول على جميع مهام التصدير الخاصة بالمستخدم' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'قائمة بمهام التصدير.',
    type: [ExportJobResponseDto],
  })
  async findAll(@Req() req: any): Promise<ExportJobResponseDto[]> {
    const userId = req.user?.id || 'mock-user-id-123'; // استخدام معرف وهمي للمحاكاة

    return this.exportService.getExportJobsForUser(userId);
  }

  /**
   * الحصول على حالة مهمة تصدير محددة.
   * @param req طلب HTTP (لاستخراج معرف المستخدم).
   * @param id معرف مهمة التصدير.
   * @returns مهمة التصدير.
   */
  @Get(':id')
  @ApiOperation({ summary: 'الحصول على حالة مهمة تصدير محددة' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تفاصيل مهمة التصدير.',
    type: ExportJobResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على المهمة.',
  })
  async findOne(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<ExportJobResponseDto> {
    const userId = req.user?.id || 'mock-user-id-123'; // استخدام معرف وهمي للمحاكاة

    return this.exportService.getExportJobStatus(userId, id);
  }

  /**
   * حذف مهمة تصدير.
   * @param req طلب HTTP (لاستخراج معرف المستخدم).
   * @param id معرف مهمة التصدير.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // استخدام 204 No Content للحذف الناجح
  @ApiOperation({ summary: 'حذف مهمة تصدير' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'تم حذف مهمة التصدير بنجاح.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'لم يتم العثور على المهمة.',
  })
  async remove(@Req() req: any, @Param('id') id: string): Promise<void> {
    const userId = req.user?.id || 'mock-user-id-123'; // استخدام معرف وهمي للمحاكاة

    await this.exportService.deleteExportJob(userId, id);
  }
}
