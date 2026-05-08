import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ContactTypeDto {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export class RequestOtpDto {
  @ApiProperty({ example: 'usuario@email.com' })
  @IsString()
  contact!: string;

  @ApiProperty({ enum: ContactTypeDto, default: ContactTypeDto.EMAIL })
  @IsEnum(ContactTypeDto)
  contactType!: ContactTypeDto;
}