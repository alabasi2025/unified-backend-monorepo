import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // افتراض وجود PrismaService
import { CreateExportJobDto, ExportType } from './dto-create';
import { ExportJobResponseDto } from './dto-response';
import { JobStatus } from './dto-update';

/**
 * خدمة التصدير (ExportService)
 * مسؤولة عن إنشاء وإدارة مهام التصدير.
 */
@Injectable()
export class ExportService {
  // افتراض حقن PrismaService للتعامل مع قاعدة البيانات
  constructor(private prisma: PrismaService) {}

  /**
   * تحويل نموذج Prisma إلى DTO للاستجابة.
   * @param job نموذج مهمة التصدير من Prisma.
   * @returns ExportJobResponseDto.
   */
  private toResponseDto(job: any): ExportJobResponseDto {
    return {
      id: job.id,
      userId: job.userId,
      notebookId: job.notebookId,
      noteId: job.noteId,
      exportType: job.exportType as ExportType,
      status: job.status as JobStatus,
      filePath: job.filePath,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

  /**
   * إنشاء مهمة تصدير جديدة.
   * @param userId معرف المستخدم الذي يطلب التصدير.
   * @param createExportJobDto بيانات إنشاء المهمة.
   * @returns مهمة التصدير التي تم إنشاؤها.
   */
  async createExportJob(
    userId: string,
    createExportJobDto: CreateExportJobDto,
  ): Promise<ExportJobResponseDto> {
    const { notebookId, noteId, exportType } = createExportJobDto;

    // التحقق من أن أحد المعرفين (notebookId أو noteId) موجود
    if (!notebookId && !noteId) {
      throw new BadRequestException(
        'يجب تحديد إما notebookId أو noteId لإنشاء مهمة تصدير.',
      );
    }

    // إنشاء سجل مهمة التصدير في قاعدة البيانات (حالة PENDING افتراضياً)
    const newJob = await this.prisma.exportJob.create({
      data: {
        userId,
        notebookId,
        noteId,
        exportType,
        status: JobStatus.PENDING,
      },
    });

    // ********************************************************
    // * ملاحظة: في تطبيق حقيقي، سيتم هنا إرسال المهمة إلى قائمة انتظار
    // * (مثل RabbitMQ أو AWS SQS) ليتم معالجتها بواسطة عامل خلفي (Worker).
    // * هنا، سنقوم بمحاكاة العملية بشكل غير متزامن.
    // ********************************************************
    this.simulateExportProcess(newJob.id, userId, exportType);

    return this.toResponseDto(newJob);
  }

  /**
   * محاكاة عملية التصدير الفعلية (تحديث الحالة والمسار).
   * @param jobId معرف المهمة.
   * @param userId معرف المستخدم.
   * @param exportType نوع التصدير.
   */
  private async simulateExportProcess(
    jobId: string,
    userId: string,
    exportType: ExportType,
  ): Promise<void> {
    // محاكاة تأخير بسيط لبدء المعالجة
    await new Promise(resolve => setTimeout(resolve, 1000));

    // تحديث الحالة إلى قيد التنفيذ
    await this.prisma.exportJob.update({
      where: { id: jobId },
      data: { status: JobStatus.IN_PROGRESS },
    });

    // محاكاة وقت التصدير
    await new Promise(resolve => setTimeout(resolve, 3000));

    // محاكاة إنشاء مسار الملف
    const simulatedFilePath = `/exports/${userId}/${jobId}.${exportType.toLowerCase()}`;

    // تحديث الحالة إلى مكتملة والمسار
    await this.prisma.exportJob.update({
      where: { id: jobId },
      data: {
        status: JobStatus.COMPLETED,
        filePath: simulatedFilePath,
      },
    });
  }

  /**
   * الحصول على حالة مهمة تصدير محددة.
   * @param userId معرف المستخدم.
   * @param jobId معرف المهمة.
   * @returns مهمة التصدير.
   */
  async getExportJobStatus(
    userId: string,
    jobId: string,
  ): Promise<ExportJobResponseDto> {
    const job = await this.prisma.exportJob.findUnique({
      where: { id: jobId, userId },
    });

    if (!job) {
      throw new NotFoundException(
        `لم يتم العثور على مهمة التصدير بالمعرف ${jobId} لهذا المستخدم.`,
      );
    }

    return this.toResponseDto(job);
  }

  /**
   * الحصول على جميع مهام التصدير الخاصة بالمستخدم.
   * @param userId معرف المستخدم.
   * @returns قائمة بمهام التصدير.
   */
  async getExportJobsForUser(
    userId: string,
  ): Promise<ExportJobResponseDto[]> {
    const jobs = await this.prisma.exportJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map(this.toResponseDto);
  }

  /**
   * حذف مهمة تصدير (مفيدة لتنظيف السجلات القديمة).
   * @param userId معرف المستخدم.
   * @param jobId معرف المهمة.
   */
  async deleteExportJob(userId: string, jobId: string): Promise<void> {
    try {
      await this.prisma.exportJob.delete({
        where: { id: jobId, userId },
      });
    } catch (error) {
      // التعامل مع حالة عدم وجود المهمة
      throw new NotFoundException(
        `لم يتم العثور على مهمة التصدير بالمعرف ${jobId} لهذا المستخدم لحذفها.`,
      );
    }
  }
}
