import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfessionsModule } from './modules/professions/professions.module';
import { AvatarsModule } from './modules/avatars/avatars.module';
import { PollsModule } from './modules/polls/polls.module';
import { VotingModule } from './modules/voting/voting.module';
import { OfficialsModule } from './modules/officials/officials.module';
import { AuditModule } from './modules/audit/audit.module';
import { appConfig, authConfig, databaseConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL_SECONDS ?? '60') * 1000,
        limit: parseInt(process.env.THROTTLE_LIMIT ?? '30'),
      },
    ]),
    PrismaModule,
    AuditModule,
    AuthModule,
    UsersModule,
    ProfessionsModule,
    AvatarsModule,
    PollsModule,
    VotingModule,
    OfficialsModule,
  ],
})
export class AppModule {}
