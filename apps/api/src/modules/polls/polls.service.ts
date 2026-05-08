import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PollQueryDto } from './dto/poll-query.dto';
import { PollStatus } from '@prisma/client';

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PollQueryDto) {
    const { status, category, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const now = new Date();

    const where: any = { isPublic: true };
    if (status) where.status = status as PollStatus;
    if (category) where.category = category;

    const [data, total] = await Promise.all([
      this.prisma.poll.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startsAt: 'desc' },
        include: { options: { orderBy: { order: 'asc' } }, _count: { select: { ballots: true } } },
      }),
      this.prisma.poll.count({ where }),
    ]);

    return {
      data: data.map(p => ({ ...p, totalVotes: p._count.ballots, _count: undefined })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id },
      include: {
        options: { orderBy: { order: 'asc' } },
        officialLinks: { include: { official: true } },
        _count: { select: { ballots: true } },
      },
    });
    if (!poll) throw new NotFoundException('Votación no encontrada');
    return { ...poll, totalVotes: poll._count.ballots, _count: undefined };
  }

  async getResults(pollId: string) {
  const poll = await this.findOne(pollId);
  const aggregated = await this.prisma.aggregatedResult.findMany({
    where: { pollId },
    include: { option: true },
  });

  // Total usa 'GENERAL' como clave
  const generalResults = aggregated.filter(r => r.professionId === 'GENERAL');
  const total = generalResults.reduce((s, r) => s + r.count, 0);

  const general = poll.options.map((opt: any) => {
    const result = generalResults.find(r => r.optionId === opt.id);
    const count = result?.count ?? 0;
    return {
      optionId: opt.id,
      text: opt.text,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  // Por profesión — excluye 'GENERAL'
  const professionIds = [
    ...new Set(
      aggregated
        .filter(r => r.professionId && r.professionId !== 'GENERAL')
        .map(r => r.professionId!)
    ),
  ];

  const byProfession = await Promise.all(
    professionIds.map(async profId => {
      const prof = await this.prisma.profession.findUnique({ where: { id: profId } });
      const profResults = aggregated.filter(r => r.professionId === profId);
      const profTotal = profResults.reduce((s, r) => s + r.count, 0);
      const options = poll.options.map((opt: any) => {
        const result = profResults.find(r => r.optionId === opt.id);
        const count = result?.count ?? 0;
        return {
          optionId: opt.id,
          text: opt.text,
          count,
          percentage: profTotal > 0 ? Math.round((count / profTotal) * 100) : 0,
        };
      });
      return {
        professionId: profId,
        professionName: prof?.nameEs ?? profId,
        total: profTotal,
        options,
      };
    })
  );

  return {
    pollId,
    pollTitle: poll.title,
    total,
    options: general,
    byProfession,
  };
}
}
