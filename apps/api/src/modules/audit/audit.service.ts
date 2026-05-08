import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    eventType: string;
    actorId?: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.auditLog.create({
      data: {
        eventType: params.eventType,
        actorId: params.actorId,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata ?? undefined,
      } as any,
    });
  }
}