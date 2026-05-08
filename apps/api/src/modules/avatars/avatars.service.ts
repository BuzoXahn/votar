import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateAvatarDto {
  animalSlug!: string;
  colorHex!: string;
  nickname!: string;
}

@Injectable()
export class AvatarsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(userId: string, dto: CreateAvatarDto) {
    const existing = await this.prisma.avatar.findUnique({ where: { nickname: dto.nickname } });
    if (existing && existing.userId !== userId) {
      throw new ConflictException('Ese apodo ya está en uso');
    }

    const avatar = await this.prisma.avatar.upsert({
      where: { userId },
      update: { animalSlug: dto.animalSlug, colorHex: dto.colorHex, nickname: dto.nickname },
      create: { userId, animalSlug: dto.animalSlug, colorHex: dto.colorHex, nickname: dto.nickname },
    });

    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (profile?.professionId) {
      await this.prisma.userProfile.update({ where: { userId }, data: { setupComplete: true } });
    }

    return avatar;
  }

  findByUserId(userId: string) {
    return this.prisma.avatar.findUnique({ where: { userId } });
  }
}