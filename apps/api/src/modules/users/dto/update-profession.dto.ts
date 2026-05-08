import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfessionDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  professionId!: string;
}