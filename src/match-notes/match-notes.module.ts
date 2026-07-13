import { Module } from '@nestjs/common';
import { MatchNotesService } from './match-notes.service';
import { MatchNotesController } from './match-notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchNote } from './entities/match-note.entity';
import { MatchRosterValidationModule } from 'src/common/services/match-roster-validation/match-.roster-validation.module';

@Module({
  controllers: [MatchNotesController],
  providers: [MatchNotesService],
  imports: [TypeOrmModule.forFeature([MatchNote]),
            MatchRosterValidationModule]
})
export class MatchNotesModule {}
