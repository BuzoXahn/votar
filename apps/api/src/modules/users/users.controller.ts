import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil propio' })
  getMe(@Request() req: any) {
    return this.usersService.getMe(req.user.id);
  }

  @Put('me/profession')
  @ApiOperation({ summary: 'Actualizar profesión' })
  updateProfession(@Request() req: any, @Body() dto: UpdateProfessionDto) {
    return this.usersService.updateProfession(req.user.id, dto);
  }
}
