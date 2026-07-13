import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Importance } from "src/common/enum/importance.enum";

export class SearchRosterNote {

    @ApiPropertyOptional({
      enum: Importance,
      enumName: 'Importance',
    })

    @IsOptional()
    @IsEnum(Importance)
    search?: Importance;

}