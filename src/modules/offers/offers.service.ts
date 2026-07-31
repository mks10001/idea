import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async createOffer(data: any) {
    // data: { ideaId, investorId, offeredTokens?, offeredFiat? }
    const idea = await this.prisma.idea.findUnique({ where: { id: data.ideaId } });
    if (!idea) throw new NotFoundException('Idea not found');
    return this.prisma.offer.create({ data: { ideaId: data.ideaId, investorId: data.investorId, offeredTokens: data.offeredTokens, offeredFiat: data.offeredFiat, status: 'PENDING' } });
  }

  async getOffersForIdea(ideaId: string) {
    return this.prisma.offer.findMany({ where: { ideaId } });
  }

  async createEscrowForOffer(offerId: string, stripePaymentIntent?: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) throw new NotFoundException('Offer not found');
    return this.prisma.escrow.create({ data: { offerId, stripePaymentIntent, status: 'PENDING' } });
  }
}
