import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { GamesModule } from 'src/games/games.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/games/entities/game.entity';
import { UserRosterModule } from 'src/user-roster/user-roster.module';
import { MatchsModule } from 'src/matchs/matchs.module';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports:[TypeOrmModule.forFeature([Game]), UserRosterModule, MatchsModule]
})
export class StatsModule {}
