import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProfessionsService } from './professions.service';

@ApiTags('professions')
@Controller('professions')
export class ProfessionsController {
  constructor(private readonly service: ProfessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las profesiones' })
  findAll() {
    return this.service.findAll();
  }
}
