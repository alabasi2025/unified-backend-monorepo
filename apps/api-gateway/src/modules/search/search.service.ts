import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'idea' | 'conversation' | 'report' | 'task';
  category?: string;
  createdAt: Date;
  relevance: number;
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string, type?: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const results: SearchResult[] = [];

    // Search in Reports
    if (!type || type === 'report') {
      const reports = await this.prisma.report.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 20,
      });

      reports.forEach((report) => {
        results.push({
          id: report.id,
          title: report.title,
          content: report.content.substring(0, 200),
          type: 'report',
          category: report.category,
          createdAt: report.createdAt,
          relevance: this.calculateRelevance(searchTerm, report.title, report.content),
        });
      });
    }

    // Search in Ideas (if table exists)
    if (!type || type === 'idea') {
      try {
        const ideas = await this.prisma.idea.findMany({
          where: {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
          take: 20,
        });

        ideas.forEach((idea: any) => {
          results.push({
            id: idea.id,
            title: idea.title,
            content: idea.description?.substring(0, 200) || '',
            type: 'idea',
            category: idea.category,
            createdAt: idea.createdAt,
            relevance: this.calculateRelevance(searchTerm, idea.title, idea.description),
          });
        });
      } catch (error) {
        // Table doesn't exist, skip
      }
    }

    // Search in Conversations (if table exists)
    if (!type || type === 'conversation') {
      try {
        const conversations = await this.prisma.conversation.findMany({
          where: {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { content: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
          take: 20,
        });

        conversations.forEach((conv: any) => {
          results.push({
            id: conv.id,
            title: conv.title,
            content: conv.content?.substring(0, 200) || '',
            type: 'conversation',
            category: conv.topic,
            createdAt: conv.createdAt,
            relevance: this.calculateRelevance(searchTerm, conv.title, conv.content),
          });
        });
      } catch (error) {
        // Table doesn't exist, skip
      }
    }

    // Search in Tasks (if table exists)
    if (!type || type === 'task') {
      try {
        const tasks = await this.prisma.task.findMany({
          where: {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
          take: 20,
        });

        tasks.forEach((task: any) => {
          results.push({
            id: task.id,
            title: task.title,
            content: task.description?.substring(0, 200) || '',
            type: 'task',
            category: task.category,
            createdAt: task.createdAt,
            relevance: this.calculateRelevance(searchTerm, task.title, task.description),
          });
        });
      } catch (error) {
        // Table doesn't exist, skip
      }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return results;
  }

  private calculateRelevance(searchTerm: string, title: string, content: string): number {
    let relevance = 0;
    const titleLower = title.toLowerCase();
    const contentLower = content?.toLowerCase() || '';

    // Exact match in title = highest relevance
    if (titleLower === searchTerm) {
      relevance += 1.0;
    } else if (titleLower.includes(searchTerm)) {
      relevance += 0.8;
    }

    // Match in content
    if (contentLower.includes(searchTerm)) {
      relevance += 0.3;
    }

    // Frequency bonus
    const frequency = (contentLower.match(new RegExp(searchTerm, 'g')) || []).length;
    relevance += Math.min(frequency * 0.05, 0.2);

    return Math.min(relevance, 1.0);
  }
}
