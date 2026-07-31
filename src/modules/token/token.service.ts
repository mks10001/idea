import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    return this.prisma.wallet.findFirst({ where: { userId, currencyType: 'SITE_TOKEN' } });
  }

  async ensureWallet(userId: string) {
    let wallet = await this.getWallet(userId);
    if (!wallet) {
      wallet = await this.prisma.wallet.create({ data: { userId, currencyType: 'SITE_TOKEN', balance: 0 } });
    }
    return wallet;
  }

  async getBalance(userId: string) {
    const wallet = await this.getWallet(userId);
    return wallet ? wallet.balance : 0;
  }

  /**
   * Issue tokens to a user as an atomic DB transaction.
   * Returns the created TokenTransaction and the new wallet state.
   */
  async issueTokensToUser(userId: string, amount: number, meta: any = {}) {
    const reward = Number(amount || process.env.ISSUE_REWARD_AMOUNT || 100);
    const result = await this.prisma.$transaction(async (tx) => {
      // ensure wallet
      let wallet = await tx.wallet.findFirst({ where: { userId, currencyType: 'SITE_TOKEN' } });
      if (!wallet) {
        wallet = await tx.wallet.create({ data: { userId, currencyType: 'SITE_TOKEN', balance: reward } });
      } else {
        wallet = await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: reward } } });
      }

      const txRecord = await tx.tokenTransaction.create({
        data: {
          toWalletId: wallet.id,
          amount: reward,
          type: 'ISSUE',
          status: 'COMPLETED',
          meta,
        },
      });

      return { wallet, txRecord };
    });

    return result;
  }
}
