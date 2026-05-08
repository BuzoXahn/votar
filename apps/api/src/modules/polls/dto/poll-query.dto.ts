import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum PollStatusFilter { ACTIVE = 'ACTIVE', CLOSED = 'CLOSED', DRAFT = 'DRAFT' }

export class PollQueryDto {
  @ApiPropertyOptional({ enum: PollStatusFilter })
  @IsOptional()
  @IsEnum(PollStatusFilter)
  status?: PollStatusFilter;

  @ApiPropertyOptional({ example: 'ley' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
