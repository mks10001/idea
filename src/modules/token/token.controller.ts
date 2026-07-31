import { Controller, Get, Param } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('api/token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get('balance/:userId')
  async balance(@Param('userId') userId: string) {
    const balance = await this.tokenService.getBalance(userId);
    return { balance };
  }
}
