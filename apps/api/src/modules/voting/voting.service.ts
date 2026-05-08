import { Injectable } from '@nestjs/common';
import { EligibilityService } from './eligibility.service';
import { BallotService } from './ballot.service';
import { CastVoteDto } from './dto/cast-vote.dto';

@Injectable()
export class VotingService {
  constructor(
    private readonly eligibility: EligibilityService,
    private readonly ballot: BallotService,
  ) {}

  checkEligibility(userId: string, pollId: string) {
    return this.eligibility.check(userId, pollId);
  }

  castVote(pollId: string, dto: CastVoteDto) {
    return this.ballot.cast(pollId, dto);
  }
}
