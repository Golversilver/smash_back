import { IsEnum, IsOptional, IsString } from "class-validator";
import { Importance } from "src/common/enum/importance.enum";

export class SearchMatchNote {
    @IsOptional()
    @IsEnum(Importance)
    search?: Importance;
}