import { Module } from '@nestjs/common';
import { PrismaModule } from '@semop/multi-entity';
import { AccountService } from '../../../../1-core-services/accounting/src/lib/services/account.service';
import { AccountsController } from './controllers/accounts.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AccountsController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountingModule {}
