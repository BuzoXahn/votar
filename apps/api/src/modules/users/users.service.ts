import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfessionDto } from './dto/update-profession.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: { include: { profession: true } },
        avatar: true,
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return {
      id: user.id,
      setupComplete: user.profile?.setupComplete ?? false,
      professionId: user.profile?.professionId,
      profession: user.profile?.profession,
      avatar: user.avatar,
    };
  }

  async updateProfession(userId: string, dto: UpdateProfessionDto) {
    const profession = await this.prisma.profession.findUnique({ where: { id: dto.professionId } });
    if (!profession) throw new NotFoundException('Profesión no encontrada');

    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: { professionId: dto.professionId },
      create: { userId, professionId: dto.professionId },
    });

    // Marcar setup completo si también tiene avatar
    const avatar = await this.prisma.avatar.findUnique({ where: { userId } });
    if (avatar && profile.professionId) {
      await this.prisma.userProfile.update({
        where: { userId },
        data: { setupComplete: true },
      });
    }

    return { professionId: dto.professionId, setupComplete: !!avatar };
  }
}
