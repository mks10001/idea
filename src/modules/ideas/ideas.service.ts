import { Injectable } from '@nestjs/common';
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
}
