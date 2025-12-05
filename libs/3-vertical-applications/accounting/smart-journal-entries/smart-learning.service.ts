// PHASE-15: Smart Journal Entries System - Smart Learning Service
// This service handles AI-powered learning and account suggestions

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../1-core-services/prisma/prisma.service';
import {
  SuggestedAccountDto,
  AccountSuggestionRequestDto,
  RecordUsageDto,
  UsageStatisticsDto,
} from '@semop/contracts';

@Injectable()
export class SmartLearningService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Record account usage for learning
   */
  async recordUsage(dto: RecordUsageDto): Promise<void> {
    const existing = await this.prisma.smartLearningLog.findFirst({
      where: {
        operationType: dto.operationType,
        contextType: dto.contextType || null,
        contextId: dto.contextId || null,
        accountId: dto.accountId,
      },
    });

    if (existing) {
      // Update existing record
      await this.prisma.smartLearningLog.update({
        where: { id: existing.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });
    } else {
      // Create new record
      await this.prisma.smartLearningLog.create({
        data: {
          operationType: dto.operationType,
          contextType: dto.contextType,
          contextId: dto.contextId,
          accountId: dto.accountId,
          usageCount: 1,
          lastUsedAt: new Date(),
        },
      });
    }
  }

  /**
   * Get suggested accounts based on learning
   */
  async getSuggestedAccounts(dto: AccountSuggestionRequestDto): Promise<SuggestedAccountDto[]> {
    const limit = dto.limit || 5;

    // Build where clause
    const where: any = {
      operationType: dto.operationType,
    };

    if (dto.contextType && dto.contextId) {
      where.contextType = dto.contextType;
      where.contextId = dto.contextId;
    }

    // Get learning logs
    const logs = await this.prisma.smartLearningLog.findMany({
      where,
      // Fetch more logs than the limit to allow for better scoring and filtering
      // We will re-sort them later based on the calculated score
      orderBy: [
        { usageCount: 'desc' },
        { lastUsedAt: 'desc' },
      ],
      take: limit * 5, // Fetch 5 times the limit for better candidates
    });

    // 1. Calculate a weighted score for each log (Usage + Recency)
    const now = new Date();
    const halfLifeDays = 90; // Accounts lose half their weight after 90 days

    const scoredLogs = logs.map(log => {
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysSinceLastUse = (now.getTime() - log.lastUsedAt.getTime()) / msPerDay;
      
      // Exponential decay factor: 0.5 ^ (daysSinceLastUse / halfLifeDays)
      const recencyFactor = Math.pow(0.5, daysSinceLastUse / halfLifeDays);
      
      // Weighted Score: UsageCount * (1 + RecencyFactor)
      // The recency factor acts as a boost to the usage count
      const weightedScore = log.usageCount * (1 + recencyFactor);

      return {
        ...log,
        weightedScore,
        recencyFactor,
      };
    });

    // 2. Sort the logs by the new weighted score
    scoredLogs.sort((a, b) => b.weightedScore - a.weightedScore);

    // 3. Apply the final limit
    const topLogs = scoredLogs.slice(0, limit);

    // Get account details (assuming accounts table exists)
    const suggestions: SuggestedAccountDto[] = [];

    // Get all unique account IDs from topLogs
    const accountIds = topLogs.map(log => log.accountId);

    // Fetch all account details in a single query for efficiency
    // Note: Using $queryRawUnsafe for dynamic IN clause
    const accountDetails = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT id, code, name_ar, name_en
      FROM accounts
      WHERE id IN (${accountIds.map(id => `'${id}'`).join(',')})
    `);

    const accountMap = new Map(accountDetails.map(acc => [acc.id, acc]));

    // 4. Process the top logs and calculate confidence
    const maxUsage = topLogs[0]?.usageCount || 1;

    for (const log of topLogs) {
      const acc = accountMap.get(log.accountId);

      if (acc) {
        // Calculate confidence (0-100) based on the original usage count
        const confidence = Math.round((log.usageCount / maxUsage) * 100);

        suggestions.push({
          accountId: log.accountId,
          accountCode: acc.code,
          accountNameAr: acc.name_ar,
          accountNameEn: acc.name_en,
          usageCount: log.usageCount,
          lastUsedAt: log.lastUsedAt,
          confidence,
        });
      }
    }

    return suggestions;
  }

  /**
   * Get usage statistics for an account
   */
  async getUsageStatistics(accountId: string): Promise<UsageStatisticsDto> {
    const logs = await this.prisma.smartLearningLog.findMany({
      where: { accountId },
    });

    const totalUsage = logs.reduce((sum, log) => sum + log.usageCount, 0);

    const usageByOperationType: Record<string, number> = {};
    const usageByContext: Record<string, number> = {};

    let lastUsedAt = new Date(0);

    for (const log of logs) {
      // Group by operation type
      usageByOperationType[log.operationType] =
        (usageByOperationType[log.operationType] || 0) + log.usageCount;

      // Group by context
      if (log.contextType && log.contextId) {
        const contextKey = `${log.contextType}:${log.contextId}`;
        usageByContext[contextKey] =
          (usageByContext[contextKey] || 0) + log.usageCount;
      }

      // Track latest usage
      if (log.lastUsedAt > lastUsedAt) {
        lastUsedAt = log.lastUsedAt;
      }
    }

    return {
      accountId,
      totalUsage,
      usageByOperationType,
      usageByContext,
      lastUsedAt,
    };
  }

  /**
   * Clear learning data for a specific operation type
   */
  async clearLearningData(operationType: string): Promise<void> {
    await    // Get learning logs
    const logs = await this.prisma.smartLearningLog.findMany({
      where,
      // Fetch more logs than the limit to allow for better scoring and filtering
      // We will re-sort them later based on the calculated score
      orderBy: [
        { usageCount: 'desc' },
        { lastUsedAt: 'desc' },
      ],
      take: limit * 5, // Fetch 5 times the limit for better candidates
    });

    // 1. Calculate a weighted score for each log (Usage + Recency)
    const now = new Date();
    const halfLifeDays = 90; // Accounts lose half their weight after 90 days

    const scoredLogs = logs.map(log => {
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysSinceLastUse = (now.getTime() - log.lastUsedAt.getTime()) / msPerDay;
      
      // Exponential decay factor: 0.5 ^ (daysSinceLastUse / halfLifeDays)
      const recencyFactor = Math.pow(0.5, daysSinceLastUse / halfLifeDays);
      
      // Weighted Score: UsageCount * (1 + RecencyFactor)
      // The recency factor acts as a boost to the usage count
      const weightedScore = log.usageCount * (1 + recencyFactor);

      return {
        ...log,
        weightedScore,
        recencyFactor,
      };
    });

    // 2. Sort the logs by the new weighted score
    scoredLogs.sort((a, b) => b.weightedScore - a.weightedScore);

    // 3. Apply the final limit
    const topLogs = scoredLogs.slice(0, limit);

    // Get account details (assuming accounts table exists)
    const suggestions: SuggestedAccountDto[] = [];

    // Get all unique account IDs from topLogs
    const accountIds = topLogs.map(log => log.accountId);

    // Fetch all account details in a single query for efficiency
    // Note: Using $queryRawUnsafe for dynamic IN clause
    const accountDetails = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT id, code, name_ar, name_en
      FROM accounts
      WHERE id IN (${accountIds.map(id => `'${id}'`).join(',')})
    `);

    const accountMap = new Map(accountDetails.map(acc => [acc.id, acc]));

    // 4. Process the top logs and calculate confidence
    const maxUsage = topLogs[0]?.usageCount || 1;

    for (const log of topLogs) {
      const acc = accountMap.get(log.accountId);

      if (acc) {
        // Calculate confidence (0-100) based on the original usage count
        const confidence = Math.round((log.usageCount / maxUsage) * 100);

        suggestions.push({
          accountId: log.accountId,
          accountCode: acc.code,
          accountNameAr: acc.name_ar,
          accountNameEn: acc.name_en,
          usageCount: log.usageCount,
          lastUsedAt: log.lastUsedAt,
          confidence,
        });
      }
    }

    return suggestions;
  }urn suggestions;
  }

  /**
   * Get usage statistics for an account
   */
  async getUsageStatistics(accountId: string): Promise<UsageStatisticsDto> {
    const logs = await this.prisma.smartLearningLog.findMany({
      where: { accountId },
    });

    const totalUsage = logs.reduce((sum, log) => sum + log.usageCount, 0);

    const usageByOperationType: Record<string, number> = {};
    const usageByContext: Record<string, number> = {};

    let lastUsedAt = new Date(0);

    for (const log of logs) {
      // Group by operation type
      usageByOperationType[log.operationType] =
        (usageByOperationType[log.operationType] || 0) + log.usageCount;

      // Group by context
      if (log.contextType && log.contextId) {
        const contextKey = `${log.contextType}:${log.contextId}`;
        usageByContext[contextKey] =
          (usageByContext[contextKey] || 0) + log.usageCount;
      }

      // Track latest usage
      if (log.lastUsedAt > lastUsedAt) {
        lastUsedAt = log.lastUsedAt;
      }
    }

    return {
      accountId,
      totalUsage,
      usageByOperationType,
      usageByContext,
      lastUsedAt,
    };
  }

  /**
   * Clear learning data for a specific operation type
   */
  async clearLearningData(operationType: string): Promise<void> {
    await this.prisma.smartLearningLog.deleteMany({
      where: { operationType },
    });
  }

  /**
   * Clear all learning data
   */
  async clearAllLearningData(): Promise<void> {
    await this.prisma.smartLearningLog.deleteMany({});
  }
}
