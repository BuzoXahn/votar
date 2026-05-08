import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';
import { PollStatus } from '@prisma/client';

@Injectable()
export class EligibilityService {
  constructor(private readonly prisma: PrismaService) {}

  async check(userId: string, pollId: string) {
    const poll = await this.prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll) throw new NotFoundException('Votación no encontrada');
    if (poll.status !== PollStatus.ACTIVE) throw new BadRequestException('Esta votación no está activa');
    const now = new Date();
    if (now < poll.startsAt || now > poll.endsAt) throw new BadRequestException('Votación fuera de período');

    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile?.setupComplete) throw new ForbiddenException('Completa tu perfil antes de votar');

    // Verificar si ya votó
    const existing = await this.prisma.eligibilityToken.findUnique({
      where: { userId_pollId: { userId, pollId } },
    });
    if (existing?.isUsed) return { eligible: false, alreadyVoted: true };

    // Generar token de un solo uso
    const plainToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(plainToken).digest('hex');
    const expiresAt = new Date(Date.now() + parseInt(process.env.ELIGIBILITY_TOKEN_EXPIRES_IN_MINUTES ?? '15') * 60_000);

    await this.prisma.eligibilityToken.upsert({
      where: { userId_pollId: { userId, pollId } },
      update: { tokenHash, expiresAt, isUsed: false },
      create: { userId, pollId, tokenHash, expiresAt },
    });

    return { eligible: true, alreadyVoted: false, token: plainToken };
  }
}
