import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = '/api/accounting/analytics'; // افتراض أن نقطة النهاية هي /api/accounting/analytics

  constructor(private http: HttpClient) { }

  /**
   * جلب بيانات التحليلات المتقدمة من الـ Backend.
   * @param query معلمات الاستعلام.
   * @returns Observable لبيانات التحليلات.
   */
  getAdvancedAnalytics(query: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/advanced`, { params: query });
  }
}
