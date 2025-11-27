import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  getBalance(userId: string): { userId: string; balance: number } {
    this.logger.log(`Processing getBalance for user: ${userId}`);
    // منطق جلب الرصيد الفعلي
    return { userId, balance: 1000.50 };
  }
}
