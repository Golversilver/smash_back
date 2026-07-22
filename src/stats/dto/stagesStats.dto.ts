import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class StagesStatsDto {

  @IsOptional()
  @IsInt()
  userRosterId?: number;

  @IsOptional()
  @IsBoolean()
  online?: boolean;

}