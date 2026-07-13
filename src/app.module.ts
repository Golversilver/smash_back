import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StagesModule } from './stages/stages.module';
import { GamesModule } from './games/games.module';
import { MatchsModule } from './matchs/matchs.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';
import { MatchNotesModule } from './match-notes/match-notes.module';
import { RosterNotesModule } from './roster-notes/roster-notes.module';
import { UserRosterModule } from './user-roster/user-roster.module';
import { CharactersModule } from './characters/characters.module';
import { AuthModule } from './auth/auth.module';
import { MatchRosterValidationService } from './common/services/match-roster-validation/match-roster-validation.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
    })
  }),
  StagesModule,
  GamesModule,
  MatchsModule,
  StatsModule,
  UsersModule,
  MatchNotesModule,
  RosterNotesModule,
  UserRosterModule,
  CharactersModule,
  AuthModule],
  controllers: [AppController],
  providers: [AppService, MatchRosterValidationService],
})
export class AppModule {}
