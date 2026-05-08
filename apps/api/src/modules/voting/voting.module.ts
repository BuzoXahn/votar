import { Module } from '@nestjs/common';
import { VotingService } from './voting.service';
import { VotingController } from './voting.controller';
import { EligibilityService } from './eligibility.service';
import { BallotService } from './ballot.service';

@Module({
  controllers: [VotingController],
  providers: [VotingService, EligibilityService, BallotService],
})
export class VotingModule {}
