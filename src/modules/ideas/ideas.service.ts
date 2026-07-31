import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IdeasService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.idea.findMany({ where: { status: { not: 'DELETED' } }, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.prisma.idea.create({ data: { authorId: data.authorId, title: data.title, description: data.description, attachments: data.attachments, status: data.status || 'DRAFT', targetAmount: data.targetAmount } });
  }

  async get(id: string) {
    return this.prisma.idea.findUnique({ where: { id } });
  }

  /**
   * Approve an idea and issue tokens to the author atomically.
   * Returns { idea, wallet, txRecord }
   */
  async approve(id: string, opts: any = {}) {
    const idea = await this.prisma.idea.findUnique({ where: { id } });
    if (!idea) throw new NotFoundException('Idea not found');
    if (idea.status === 'APPROVED') throw new BadRequestException('Idea already approved');

    const rewardAmount = Number(opts.rewardAmount ?? process.env.ISSUE_REWARD_AMOUNT ?? 100);

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedIdea = await tx.idea.update({ where: { id }, data: { status: 'APPROVED' } });

      // find or create wallet
      let wallet = await tx.wallet.findFirst({ where: { userId: idea.authorId, currencyType: 'SITE_TOKEN' } });
      if (!wallet) {
        wallet = await tx.wallet.create({ data: { userId: idea.authorId, currencyType: 'SITE_TOKEN', balance: rewardAmount } });
      } else {
        wallet = await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: rewardAmount } } });
      }

      const txRecord = await tx.tokenTransaction.create({
        data: {
          toWalletId: wallet.id,
          amount: rewardAmount,
          type: 'ISSUE',
          status: 'COMPLETED',
          meta: { ideaId: id, admin: opts.adminId ?? null },
        },
      });

      return { idea: updatedIdea, wallet, txRecord };
    });

    return result;
  }
}
