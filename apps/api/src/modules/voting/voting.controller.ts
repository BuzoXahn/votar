import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VotingService } from './voting.service';
import { CastVoteDto } from './dto/cast-vote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('voting')
@Controller('polls')
export class VotingController {
  constructor(private readonly votingService: VotingService) {}

  @Get(':id/eligibility')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar elegibilidad y obtener token de voto' })
  checkEligibility(@Request() req: any, @Param('id') pollId: string) {
    return this.votingService.checkEligibility(req.user.id, pollId);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Emitir voto (no requiere JWT, usa token de elegibilidad)' })
  castVote(@Param('id') pollId: string, @Body() dto: CastVoteDto) {
    return this.votingService.castVote(pollId, dto);
  }
}
