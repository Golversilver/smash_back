import { Module } from "@nestjs/common";
import { MatchRosterValidationService } from "./match-roster-validation.service"
import { UserRosterModule } from "src/user-roster/user-roster.module";
import { MatchsModule } from "src/matchs/matchs.module";

   @Module({
      providers: [MatchRosterValidationService],
      exports: [MatchRosterValidationService],
      imports: [
          UserRosterModule,
          MatchsModule
      ]
    })


export class MatchRosterValidationModule{}