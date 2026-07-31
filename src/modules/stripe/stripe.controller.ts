import { Controller, Post, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { Request, Response } from 'express';

@Controller('api/webhook')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const rawBody = (req as any).rawBody || req.body; // prefer rawBody set by express.raw
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: Stripe.Event;

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });
      event = stripe.webhooks.constructEvent(rawBody, sig, secret);
    } catch (err) {
      console.error('Webhook signature verification failed', err);
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    try {
      await this.stripeService.handleEvent(event);
      return res.send({ received: true });
    } catch (err) {
      console.error('Error processing stripe event', err);
      return res.status(500).send('Internal error');
    }
  }
}
