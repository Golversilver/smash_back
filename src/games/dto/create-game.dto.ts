import { Type } from "class-transformer";
import { IsBoolean, IsInt } from "class-validator";

export class CreateGameDto {

    @IsBoolean()
    online!: boolean

    @IsBoolean()
    win!: boolean

    @Type(() => Number)
    @IsInt()
    stageId!: number;

    @Type(() => Number)
    @IsInt()
    userRosterId!: number;  


    @Type(() => Number)
    @IsInt()
    characterRival!: number;  
}

