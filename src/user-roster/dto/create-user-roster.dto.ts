import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber } from "class-validator";

export class CreateUserRosterDto {
  @IsBoolean()
  main!: boolean;

  @Type(() => Number)
  @IsInt()
  characterId!: number;
}
