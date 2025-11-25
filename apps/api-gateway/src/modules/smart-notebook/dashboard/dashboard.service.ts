import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getStats(userId: string): Promise<any> {
    return {
      total_pages: 0,
      total_notes: 0,
      total_ideas: 0,
      total_tasks: 0,
    };
  }

  async getRecentActivity(userId: string): Promise<any> {
    return {
      activities: [],
      count: 0,
    };
  }

  async getSummary(userId: string): Promise<any> {
    return {
      summary: 'Dashboard summary',
      last_updated: new Date().toISOString(),
    };
  }
}
