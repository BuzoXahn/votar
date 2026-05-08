import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { createHash } from 'crypto';
import { CastVoteDto } from './dto/cast-vote.dto';

@Injectable()
export class BallotService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async cast(pollId: string, dto: CastVoteDto) {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');

    const eligToken = await this.prisma.eligibilityToken.findUnique({ where: { tokenHash } });
    if (!eligToken) throw new BadRequestException('Token inválido');
    if (eligToken.isUsed) throw new ConflictException('Este token ya fue usado');
    if (new Date() > eligToken.expiresAt) throw new BadRequestException('Token expirado');
    if (eligToken.pollId !== pollId) throw new BadRequestException('Token no corresponde a esta votación');

    const option = await this.prisma.pollOption.findUnique({ where: { id: dto.optionId } });
    if (!option || option.pollId !== pollId) throw new BadRequestException('Opción inválida');

    const profile = await this.prisma.userProfile.findUnique({ where: { userId: eligToken.userId } });
    const professionId = profile?.professionId ?? null;

    const lastBallot = await this.prisma.ballot.findFirst({
      where: { pollId },
      orderBy: { createdAt: 'desc' },
      select: { ballotHash: true },
    });

    const now = new Date().toISOString();
    const prevHash = lastBallot?.ballotHash ?? '0000000000000000';
    const ballotHash = createHash('sha256')
      .update(`${pollId}${dto.optionId}${tokenHash}${prevHash}${now}`)
      .digest('hex');

    await this.prisma.$transaction(async tx => {
      await tx.eligibilityToken.update({
        where: { tokenHash },
        data: { isUsed: true, usedAt: new Date() },
      });

      await tx.ballot.create({
        data: {
          pollId,
          optionId: dto.optionId,
          tokenHash,
          professionId,
          prevHash,
          ballotHash,
        },
      });

      // Resultado general — usamos 'GENERAL' como valor especial en lugar de null
      await tx.aggregatedResult.upsert({
        where: {
          pollId_optionId_professionId: {
            pollId,
            optionId: dto.optionId,
            professionId: 'GENERAL',
          },
        },
        update: { count: { increment: 1 } },
        create: { pollId, optionId: dto.optionId, professionId: 'GENERAL', count: 1 },
      });

      // Resultado por profesión si aplica
      if (professionId) {
        await tx.aggregatedResult.upsert({
          where: {
            pollId_optionId_professionId: {
              pollId,
              optionId: dto.optionId,
              professionId,
            },
          },
          update: { count: { increment: 1 } },
          create: { pollId, optionId: dto.optionId, professionId, count: 1 },
        });
      }
    });

    await this.audit.log({ eventType: 'VOTE_CAST', entityType: 'poll', entityId: pollId });

    return { ballotHash, message: 'Voto registrado exitosamente' };
  }
}