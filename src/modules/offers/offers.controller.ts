import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OffersService } from './offers.service';

@Controller('api/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Body() body: any) {
    return this.offersService.createOffer(body);
  }

  @Get('idea/:ideaId')
  async listForIdea(@Param('ideaId') ideaId: string) {
    return this.offersService.getOffersForIdea(ideaId);
  }

  @Post(':id/escrow')
  async createEscrow(@Param('id') id: string, @Body() body: any) {
    return this.offersService.createEscrowForOffer(id, body.stripePaymentIntent);
  }
}
