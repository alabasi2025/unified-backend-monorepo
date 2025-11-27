import { Controller, Get, Logger } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  private readonly logger = new Logger(WalletController.name);

  constructor(private readonly walletService: WalletService) {}

  @Get('balance/:userId')
  getWalletBalance(@Param('userId') userId: string) {
    this.logger.log(`Fetching balance for user: ${userId}`);
    return this.walletService.getBalance(userId);
  }
}
