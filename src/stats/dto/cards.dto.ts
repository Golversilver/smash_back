import { IsBoolean, IsInt, IsOptional } from "class-validator";

export class CardsDto {

  @IsOptional()
  @IsInt()
  userRosterId?: number;

  @IsOptional()
  @IsBoolean()
  online?: boolean;

}