import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { MatchRosterValidationModule } from 'src/common/services/match-roster-validation/match-.roster-validation.module';
import { MatchsModule } from 'src/matchs/matchs.module';
import { UserRosterModule } from 'src/user-roster/user-roster.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [TypeOrmModule.forFeature([Game]), MatchRosterValidationModule, MatchsModule, UserRosterModule]
})

export class GamesModule {}
