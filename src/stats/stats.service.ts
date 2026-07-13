import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Game } from 'src/games/entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchStatsDto } from './dto/searchStats.dto';
import { UserRosterService } from 'src/user-roster/user-roster.service';
import { WinRateDinamic } from './dto/winRateDinamic.dto';
import { MatchsService } from 'src/matchs/matchs.service';
import { Match } from 'src/matchs/entities/match.entity';

@Injectable()
export class StatsService {

  constructor(
    @InjectRepository(Game)
    private readonly statsRepository: Repository<Game>,
    private readonly userRosterService: UserRosterService,
    private readonly matchsService: MatchsService){}

  findGames(searchStatsDto: SearchStatsDto, userId: number) {
        const query = this.statsRepository.createQueryBuilder('game')
        .leftJoin('game.userRoster', 'roster')
        .leftJoin('roster.character', 'character')
        .leftJoin('roster.user', 'user')
        .where('user.id = :userId', { userId });

        query
        .select('roster.id', 'rosterId')
        .addSelect('character.name', 'character')
        .addSelect('COUNT(game.id)', 'games')
        .addSelect('SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END)','wins',)
        .addSelect('ROUND(SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END) * 100.0 / COUNT(game.id), 2)','winRate',)
        .groupBy('roster.id')
        .addGroupBy('character.name')
        .orderBy('winRate', 'DESC')
        .addOrderBy('games', 'DESC');
        
        if (searchStatsDto.online !== undefined) {
          query.andWhere('game.online = :online', {
          online: searchStatsDto.online,
        });
        }

    return query.getRawMany();
  }


   findStages(searchStatsDto: SearchStatsDto, userId: number) {
    
      const query = this.statsRepository.createQueryBuilder('game')
      .leftJoin('game.stage', 'stage')
      .leftJoin('game.userRoster', 'roster')
      .leftJoin('roster.user', 'user')
      .where('user.id = :userId', { userId });

      query.select('stage.id', 'stageId')
      .addSelect('stage.name', 'stage')
      .addSelect('COUNT(game.id)', 'games')
      .addSelect('SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END)','wins',)
      .addSelect('ROUND(SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END) * 100.0 / COUNT(game.id), 2)','winRate',)
      .groupBy('stage.id')
      .addGroupBy('stage.name')
      .orderBy('winRate', 'DESC')
      .addOrderBy('games', 'DESC');

      if (searchStatsDto.online !== undefined) {
        query.andWhere('game.online = :online', {
        online: searchStatsDto.online,
      });
      }

    return query.getRawMany();
  }


    async findMatchs(searchStatsDto: SearchStatsDto, userId: number, rosterId: number) {

      const roster = await this.userRosterService.findOne(rosterId, userId);


      const query = this.statsRepository.createQueryBuilder('game')
      .leftJoin('game.userRoster', 'roster')
      .leftJoin('roster.user', 'user')
      .leftJoin('game.match', 'match')
      .leftJoin('match.character1', 'player1')
      .leftJoin('match.character2', 'player2')
      .where('user.id = :userId', { userId })
      .andWhere('roster.id = :rosterId', {rosterId})
      .setParameter('characterId', roster.character.id);

      

      query.select('match.id', 'matchId')

      .addSelect(
      `CASE
        WHEN player1.id = :characterId THEN player2.name
        ELSE player1.name
      END`, 'rival',
      )
      .addSelect('COUNT(game.id)', 'games')
      .addSelect('SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END)','wins',)
      .addSelect('ROUND(SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END) * 100.0 / COUNT(game.id), 2)','winRate',)

      .groupBy('match.id')
      .addGroupBy('player1.id')
      .addGroupBy('player2.id')
      .addGroupBy('player1.name')
      .addGroupBy('player2.name')
      .orderBy('winRate', 'DESC')
      .addOrderBy('games', 'DESC');

      if (searchStatsDto.online !== undefined) {
        query.andWhere('game.online = :online', {
        online: searchStatsDto.online,
      });
      }

    return query.getRawMany();
  }


   async findWinRate(winRateDinamic: WinRateDinamic, userId: number) {

      const query = this.statsRepository.createQueryBuilder('game')
      .leftJoin('game.stage', 'stage')
      .leftJoin('game.userRoster', 'roster')
      .leftJoin('roster.user', 'user')
      .leftJoin('game.match', 'match')
      .leftJoin('roster.character', 'character')
      .leftJoin('match.character1', 'player1')
      .leftJoin('match.character2', 'player2')
      .where('user.id = :userId', { userId })

      .select('COUNT(game.id)', 'games')
      .addSelect('SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END)','wins',)
      .addSelect('ROUND(SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END) * 100.0 / COUNT(game.id), 2)','winRate')

      if (winRateDinamic.online !== undefined) {
        query.andWhere('game.online = :online', {online: winRateDinamic.online});}

      if (winRateDinamic.stageId !== undefined) {
        query.andWhere('stage.id = :stageId', { stageId: winRateDinamic.stageId});
      }

      if(winRateDinamic.characterUserId !== undefined && winRateDinamic.characterRivalId !== undefined){
        const match = await this.matchsService.searchMatch(winRateDinamic.characterUserId, winRateDinamic.characterRivalId);

        query.andWhere('match.id = :matchId', { matchId: match.id});
      }
      
      if(winRateDinamic.characterUserId !== undefined){
        query.andWhere('character.id = :characterId', { characterId: winRateDinamic.characterUserId});
      }

    return query.getRawOne();

 }
}
