import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { IdeasModule } from './modules/ideas/ideas.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { PrismaModule } from './prisma/prisma.module';
import { TokenModule } from './modules/token/token.module';
import { OffersModule } from './modules/offers/offers.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, IdeasModule, WalletModule, TokenModule, OffersModule],
})
export class AppModule {}
