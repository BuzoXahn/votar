import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OfficialsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(level?: string, state?: string) {
    return this.prisma.official.findMany({
      where: {
        isActive: true,
        ...(level && { level }),
        ...(state && { state }),
      },
      orderBy: { fullName: 'asc' },
      select: { id: true, fullName: true, position: true, institution: true, level: true, state: true, photoUrl: true },
    });
  }

  async findOne(id: string) {
    const official = await this.prisma.official.findUnique({
      where: { id },
      include: { pollLinks: { include: { poll: { select: { id: true, title: true, status: true } } } } },
    });
    if (!official) throw new NotFoundException('Funcionario no encontrado');
    return {
      ...official,
      relatedPolls: official.pollLinks.map(l => ({ ...l.poll, relation: l.relation })),
      pollLinks: undefined,
    };
  }
}
