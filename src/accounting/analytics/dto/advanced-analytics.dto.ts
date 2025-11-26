import { IsOptional, IsString } from 'class-validator';

/**
 * كائن نقل البيانات (DTO) لـ Advanced Analytics
 * يمثل معلمات الاستعلام التي يمكن إرسالها إلى نقطة النهاية.
 */
export class AdvancedAnalyticsDto {
  @IsOptional()
  @IsString()
  dateRange?: string; // مثال: 'Last 30 Days', 'Q1 2025'

  @IsOptional()
  @IsString()
  analysisType?: string; // مثال: 'Profitability', 'Liquidity'
}
