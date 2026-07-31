import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
