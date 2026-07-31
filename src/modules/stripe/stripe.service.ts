import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);
  private tokenPriceCents = Number(process.env.TOKEN_PRICE_CENTS || 100);

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });
  }

  // Create a Checkout Session for purchasing tokens
  async createCheckoutSession(userId: string, tokenAmount: number, successUrl: string, cancelUrl: string) {
    const unitAmount = this.tokenPriceCents; // cents per token

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `${tokenAmount} SITE_TOKEN` },
            unit_amount: unitAmount,
          },
          quantity: tokenAmount,
        },
      ],
      metadata: { userId, tokenAmount: String(tokenAmount) },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return session;
  }

  // Handle stripe webhook events (idempotent)
  async handleEvent(event: Stripe.Event) {
    const existing = await this.prisma.stripeEvent.findUnique({ where: { eventId: event.id } });
    if (existing && existing.processedAt) {
      this.logger.log(`Stripe event ${event.id} already processed`);
      return { alreadyProcessed: true };
    }

    await this.prisma.stripeEvent.upsert({
      where: { eventId: event.id },
      update: { type: event.type },
      create: { eventId: event.id, type: event.type },
    });

    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
      const payload = (event.type === 'checkout.session.completed')
        ? (event.data.object as Stripe.Checkout.Session)
        : (event.data.object as Stripe.PaymentIntent);

      const metadata = (payload as any).metadata || {};
      const userId = metadata.userId;
      const tokenAmount = Number(metadata.tokenAmount || 0);

      if (!userId || tokenAmount <= 0) {
        throw new BadRequestException('Missing metadata for token purchase');
      }

      await this.prisma.$transaction(async (tx) => {
        let wallet = await tx.wallet.findFirst({ where: { userId, currencyType: 'SITE_TOKEN' } });
        if (!wallet) {
          wallet = await tx.wallet.create({ data: { userId, currencyType: 'SITE_TOKEN', balance: tokenAmount } });
        } else {
          wallet = await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: tokenAmount } } });
        }

        await tx.tokenTransaction.create({
          data: {
            toWalletId: wallet.id,
            amount: tokenAmount,
            type: 'PURCHASE',
            status: 'COMPLETED',
            meta: { stripeEventId: event.id },
          },
        });

        await tx.stripeEvent.update({ where: { eventId: event.id }, data: { processedAt: new Date() } });
      });

      this.logger.log(`Processed payment for user=${userId} tokens=${tokenAmount}`);
      return { success: true };
    }

    await this.prisma.stripeEvent.update({ where: { eventId: event.id }, data: { processedAt: new Date() } });
    return { success: true };
  }
}
