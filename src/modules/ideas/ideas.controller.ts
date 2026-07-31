import { Controller, Get, Param, Post, Body, NotFoundException } from '@nestjs/common';
import { IdeasService } from './ideas.service';

@Controller('api/ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Get()
  async list() {
    return this.ideasService.list();
  }

  @Post()
  async create(@Body() payload: any) {
    return this.ideasService.create(payload);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.ideasService.get(id);
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Body() body: any) {
    // body may include adminId or reward override
    const result = await this.ideasService.approve(id, body);
    if (!result) throw new NotFoundException('Idea not found or already processed');
    return result;
  }
}
