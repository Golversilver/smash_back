import { Module } from '@nestjs/common';
import { MatchNotesService } from './match-notes.service';
import { MatchNotesController } from './match-notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchNote } from './entities/match-note.entity';
import { MatchRosterValidationModule } from 'src/common/services/match-roster-validation/match-.roster-validation.module';
import { MatchsModule } from 'src/matchs/matchs.module';
import { UserRosterModule } from 'src/user-roster/user-roster.module';

@Module({
  controllers: [MatchNotesController],
  providers: [MatchNotesService],
  imports: [TypeOrmModule.forFeature([MatchNote]),
            MatchRosterValidationModule,
            MatchsModule,
            UserRosterModule]
})
export class MatchNotesModule {}
