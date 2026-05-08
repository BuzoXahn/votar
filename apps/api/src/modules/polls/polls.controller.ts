import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { PollQueryDto } from './dto/poll-query.dto';

@ApiTags('polls')
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar votaciones' })
  findAll(@Query() query: PollQueryDto) {
    return this.pollsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de votación' })
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Resultados generales y por profesión' })
  getResults(@Param('id') id: string) {
    return this.pollsService.getResults(id);
  }
}
