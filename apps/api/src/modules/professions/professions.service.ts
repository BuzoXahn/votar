import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfessionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.profession.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, slug: true, nameEs: true, category: true },
    });
  }
}
