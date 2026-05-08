import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { AuditService } from '../audit/audit.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as bcrypt from 'bcryptjs';
import { ContactType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    private readonly audit: AuditService,
  ) {}

  private async findIdentityByContact(contact: string, contactType: ContactType) {
    const normalized = contact.toLowerCase().trim();
    const allIdentities = await this.prisma.authIdentity.findMany({
      where: { contactType },
    });
    for (const identity of allIdentities) {
      const match = await bcrypt.compare(normalized, identity.contactHash);
      if (match) return identity;
    }
    return null;
  }

  async requestOtp(dto: RequestOtpDto) {
    const normalized = dto.contact.toLowerCase().trim();
    const contactType = dto.contactType as ContactType;

    let identity = await this.findIdentityByContact(normalized, contactType);
    let userId: string;

    if (!identity) {
      const contactHash = await bcrypt.hash(normalized, 10);
      const newUser = await this.prisma.user.create({
        data: {
          authIdentity: {
            create: { contactType, contactHash },
          },
          profile: { create: {} },
        },
        include: { authIdentity: true },
      });
      userId = newUser.id;
      identity = newUser.authIdentity!;
      await this.audit.log({ eventType: 'USER_CREATED', actorId: userId });
    } else {
      userId = identity.userId;
    }

    await this.otpService.generateAndSave(userId);
    await this.audit.log({ eventType: 'OTP_REQUESTED', actorId: userId });

    return {
      message: 'Código enviado',
      expiresIn: parseInt(process.env.OTP_EXPIRES_IN_MINUTES ?? '10') * 60,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const normalized = dto.contact.toLowerCase().trim();

    const identity = await this.findIdentityByContact(normalized, 'EMAIL' as ContactType);
    if (!identity) throw new NotFoundException('Usuario no encontrado');

    const valid = await this.otpService.verify(identity.userId, dto.otp);
    if (!valid) throw new UnauthorizedException('Código incorrecto');

    const accessToken = this.tokenService.generateAccessToken(identity.userId);
    const refreshToken = this.tokenService.generateRefreshToken(identity.userId);
    await this.tokenService.saveRefreshToken(identity.userId, refreshToken);

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: identity.userId },
    });

    await this.audit.log({ eventType: 'USER_LOGIN', actorId: identity.userId });

    return {
      accessToken,
      refreshToken,
      isNewUser: !profile?.setupComplete,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      const valid = await this.tokenService.validateRefreshToken(payload.sub, refreshToken);
      if (!valid) throw new UnauthorizedException('Refresh token inválido');

      const newAccessToken = this.tokenService.generateAccessToken(payload.sub);
      const newRefreshToken = this.tokenService.generateRefreshToken(payload.sub);
      await this.tokenService.saveRefreshToken(payload.sub, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout(userId: string, refreshToken: string) {
    await this.tokenService.revokeRefreshToken(userId);
    await this.audit.log({ eventType: 'USER_LOGOUT', actorId: userId });
    return { message: 'Sesión cerrada' };
  }
}