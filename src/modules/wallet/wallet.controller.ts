import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('api/wallet')
export class WalletController {
  constructor(private prisma: PrismaService) {}

  @Get('balance/:userId')
  async balance(@Param('userId') userId: string) {
    const wallet = await this.prisma.wallet.findFirst({ where: { userId, currencyType: 'SITE_TOKEN' } });
    return { balance: wallet ? wallet.balance : 0 };
  }
}
