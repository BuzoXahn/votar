import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CastVoteDto {
  @ApiProperty({ description: 'Token de elegibilidad de un solo uso' })
  @IsString()
  token!: string;

  @ApiProperty({ description: 'ID de la opción elegida' })
  @IsString()
  @IsUUID()
  optionId!: string;
}