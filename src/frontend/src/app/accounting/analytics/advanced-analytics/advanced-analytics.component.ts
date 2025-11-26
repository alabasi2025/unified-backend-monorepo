import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';

@Component({
  selector: 'app-advanced-analytics',
  templateUrl: './advanced-analytics.component.html',
  styleUrls: ['./advanced-analytics.component.css']
})
export class AdvancedAnalyticsComponent implements OnInit {
  analyticsData: any;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.fetchAdvancedAnalytics();
  }

  fetchAdvancedAnalytics(): void {
    this.isLoading = true;
    this.error = null;
    // افتراض أننا نرسل استعلامًا بسيطًا
    const query = { dateRange: 'Last 90 Days', analysisType: 'Profitability' };

    this.analyticsService.getAdvancedAnalytics(query).subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load advanced analytics data.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
