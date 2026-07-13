import { IsBoolean, IsEnum, IsString } from "class-validator";
import { Importance } from "src/common/enum/importance.enum";

export class CreateRosterNoteDto {

    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsEnum(Importance)
    importance!: Importance;

    @IsBoolean()
    is_public!: boolean;
}
