import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AvatarsService } from './avatars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString } from 'class-validator';

class AvatarBodyDto {
  @ApiProperty({ example: 'fox' }) @IsString() animalSlug!: string;
  @ApiProperty({ example: '#FF5733' }) @IsString() colorHex!: string;
  @ApiProperty({ example: 'ciudadano_42' }) @IsString() nickname!: string;
}

@ApiTags('avatars')
@Controller('avatars')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AvatarsController {
  constructor(private readonly service: AvatarsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener mi avatar' })
  getMyAvatar(@Request() req: any) {
    return this.service.findByUserId(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Crear o actualizar mi avatar' })
  upsert(@Request() req: any, @Body() dto: AvatarBodyDto) {
    return this.service.upsert(req.user.id, dto);
  }
}