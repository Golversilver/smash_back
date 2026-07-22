import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class WinRateDinamic {

      @IsOptional()
      @IsBoolean()
      online?: boolean;

      @IsOptional()
      @IsNumber()
      characterRivalId!: number;

      @IsOptional()
      @IsNumber()
      userRosterId!: number;

      @IsOptional()
      @IsNumber()
      stageId!: number;

}