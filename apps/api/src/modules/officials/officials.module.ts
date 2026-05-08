import { Module } from '@nestjs/common';
import { OfficialsService } from './officials.service';
import { OfficialsController } from './officials.controller';

@Module({
  controllers: [OfficialsController],
  providers: [OfficialsService],
})
export class OfficialsModule {}
