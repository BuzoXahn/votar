import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createHash, randomInt } from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  // Genera un OTP de 6 dígitos, lo hashea y guarda en DB
  async generateAndSave(userId: string): Promise<string> {
    const otp = randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRES_IN_MINUTES ?? '10') * 60_000);

    await this.prisma.authIdentity.update({
      where: { userId },
      data: { otpHash, otpExpiresAt: expiresAt, otpAttempts: 0 },
    });

    // En producción: enviar por email/SMS. En dev: retornamos el OTP directamente.
    console.log(`[DEV] OTP para usuario ${userId}: ${otp}`);
    return otp;
  }

  async verify(userId: string, otp: string): Promise<boolean> {
    const identity = await this.prisma.authIdentity.findUnique({ where: { userId } });
    if (!identity?.otpHash || !identity.otpExpiresAt) return false;

    const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS ?? '5');
    if (identity.otpAttempts >= maxAttempts) {
      throw new BadRequestException('Demasiados intentos. Solicita un nuevo código.');
    }
    if (new Date() > identity.otpExpiresAt) {
      throw new BadRequestException('El código ha expirado. Solicita uno nuevo.');
    }

    const valid = await bcrypt.compare(otp, identity.otpHash);
    if (!valid) {
      await this.prisma.authIdentity.update({
        where: { userId },
        data: { otpAttempts: { increment: 1 } },
      });
      return false;
    }

    // Invalida el OTP después de usarlo
    await this.prisma.authIdentity.update({
      where: { userId },
      data: { otpHash: null, otpExpiresAt: null, otpAttempts: 0, lastLoginAt: new Date() },
    });
    return true;
  }
}
