import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  generateAccessToken(userId: string): string {
    return this.jwt.sign({ sub: userId });
  }

  generateRefreshToken(userId: string): string {
    return this.jwt.sign(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'fallback-dev-refresh-secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
      },
    );
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.authIdentity.update({
      where: { userId },
      data: { refreshTokenHash: hash },
    });
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const identity = await this.prisma.authIdentity.findUnique({ where: { userId } });
    if (!identity?.refreshTokenHash) return false;
    return bcrypt.compare(refreshToken, identity.refreshTokenHash);
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.prisma.authIdentity.update({
      where: { userId },
      data: { refreshTokenHash: null },
    });
  }

  verifyRefreshToken(token: string): { sub: string } {
    return this.jwt.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'fallback-dev-refresh-secret',
    });
  }
}
