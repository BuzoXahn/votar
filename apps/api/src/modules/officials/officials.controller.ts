import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OfficialsService } from './officials.service';

@ApiTags('officials')
@Controller('officials')
export class OfficialsController {
  constructor(private readonly service: OfficialsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar funcionarios públicos' })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'state', required: false })
  findAll(@Query('level') level?: string, @Query('state') state?: string) {
    return this.service.findAll(level, state);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Perfil de funcionario' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
