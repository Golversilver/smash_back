import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Game } from 'src/games/entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchStatsDto } from './dto/searchStats.dto';
import { UserRosterService } from 'src/user-roster/user-roster.service';
import { WinRateDinamic } from './dto/winRateDinamic.dto';
import { MatchsService } from 'src/matchs/matchs.service';
import { Match } from 'src/matchs/entities/match.entity';
import { UserRoster } from 'src/user-roster/entities/user-roster.entity';
import { CardsDto } from './dto/cards.dto';
import { StagesStatsDto } from './dto/stagesStats.dto';
import { MatchStatsDto } from './dto/matchStatsDto';

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
        .select('character.id', 'characterId')
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


   findStages(stagesStatsDto: StagesStatsDto, userId: number) {
    
      const query = this.statsRepository.createQueryBuilder('game')
      .innerJoin('game.stage', 'stage')
      .innerJoin('game.userRoster', 'roster')
      .innerJoin('roster.user', 'user')
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

      if (stagesStatsDto.online !== undefined) {
        query.andWhere('game.online = :online', {
        online: stagesStatsDto.online,
      });
      }

      if (stagesStatsDto.userRosterId !== undefined) {
        query.andWhere('roster.id = :rosterId', {
        rosterId: stagesStatsDto.userRosterId ,
      });
      }


    return query.getRawMany();
  }


    async findMatchs(matchStatsDto: MatchStatsDto, userId: number, rosterId: number) {

      const roster = await this.userRosterService.findOne(rosterId, userId);

      const page = matchStatsDto.page ?? 1;
      const limit = matchStatsDto.limit ?? 10;

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
      .addSelect(
      `CASE
        WHEN player1.id = :characterId THEN player2.id
        ELSE player1.id 
      END`, 'rivalId',
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
      .addOrderBy('games', 'DESC')

     if (matchStatsDto.online !== undefined) {
        query.andWhere('game.online = :online', {
          online: matchStatsDto.online,
        });
      }

      const total = (await query.clone().getRawMany()).length;

      query
        .offset((page - 1) * limit)
        .limit(limit);


      const data = await query.getRawMany();

      return {
        data,
        total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      };
  }

  

   async findWinRate(winRateDinamic: WinRateDinamic, userId: number) {

    let roster: UserRoster | undefined;

    if(winRateDinamic.userRosterId !== undefined){
       roster = await this.userRosterService.findOne(winRateDinamic.userRosterId, userId);
    }

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

      if(roster !== undefined && winRateDinamic.characterRivalId !== undefined){
        const match = await this.matchsService.searchMatch(roster.character.id, winRateDinamic.characterRivalId);

        query.andWhere('match.id = :matchId', { matchId: match.id});
      }
      
      if(roster !== undefined){
        query.andWhere('roster.id = :characterId', { characterId: roster.id});
      }

    return query.getRawOne();
 }


    async getCards(cardsDto: CardsDto, userId: number) {

      // 1. Validaciones y filtros
      let roster: UserRoster | undefined;

      if (cardsDto.userRosterId !== undefined) {
        roster = await this.userRosterService.findOne(
          cardsDto.userRosterId,
          userId,
        );
      }

      // 2. Obtener información
      const [best, worst, bestStage, worstStage] = await Promise.all([
        roster
          ? this.findMatchupCard(roster, cardsDto, userId, "DESC")
          : this.findCharacterCard(cardsDto, userId, "DESC"),

        roster
          ? this.findMatchupCard(roster, cardsDto, userId, "ASC")
          : this.findCharacterCard(cardsDto, userId, "ASC"),

        this.findStageCard(cardsDto, userId, "DESC"),
        this.findStageCard(cardsDto, userId, "ASC"),
      ]);


      // 3. Respuesta
      return roster
        ? {
            bestMatchup: best,
            worstMatchup: worst,
            bestStage,
            worstStage,
          }
        : {
            bestCharacter: best,
            worstCharacter: worst,
            bestStage,
            worstStage,
          };

    }




    private async findStageCard(cardsDto: CardsDto, userId: number, order: 'ASC' | 'DESC',) {
      
    
    const query = this.statsRepository.createQueryBuilder('game')
    .innerJoin('game.userRoster', 'roster')
    .innerJoin('roster.user', 'user')
    .innerJoin('game.stage', 'stage')
    .where('user.id = :userId', { userId });

    if (cardsDto.userRosterId !== undefined) {
      query.andWhere('roster.id = :userRosterId', {
        userRosterId: cardsDto.userRosterId,
      });
    }

    if (cardsDto.online !== undefined) {
        query.andWhere('game.online = :online', {
            online: cardsDto.online,
        });
    }

        query.select('stage.id', 'id')
             .addSelect('stage.name', 'name')
             .addSelect('COUNT(game.id)', 'games')
             .addSelect('SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END)', 'wins',)
             .addSelect(`ROUND( SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END) * 100.0 / COUNT(game.id), 2)`, 'winRate',)
             .groupBy('stage.id')
             .addGroupBy('stage.name')
             
        query.orderBy('winRate', order)
             .addOrderBy('games', 'DESC')
             .limit(1)

        return query.getRawOne();
    }



    private async findMatchupCard(roster: UserRoster, cardsDto: CardsDto, userId: number, order: 'ASC' | 'DESC'){

  
      if (cardsDto.userRosterId) {
        roster = await this.userRosterService.findOne( cardsDto.userRosterId, userId);
      }


        const query = this.statsRepository.createQueryBuilder('game')
          .innerJoin('game.userRoster', 'roster')
          .innerJoin('roster.user', 'user')
          .leftJoin('game.match', 'match')
          .leftJoin('match.character1', 'player1')
          .leftJoin('match.character2', 'player2')
          .where('user.id = :userId', { userId })
          .andWhere('roster.id = :rosterId', { rosterId: roster.id })
          .setParameter('characterId', roster.character.id);


          if (cardsDto.online !== undefined) {
              query.andWhere('game.online = :online', {
                  online: cardsDto.online,
              });
          }


        query.select(
              `CASE
                WHEN player1.id = :characterId THEN player2.id
                ELSE player1.id
                END`, 'id',)

              .addSelect(
              `CASE
                WHEN player1.id = :characterId THEN player2.name
                ELSE player1.name
               END`, 'name',)

              .addSelect('COUNT(game.id)', 'games')

              .addSelect(
                'SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END)',
                'wins',)

              .addSelect(
              `ROUND(
                     SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END)
                     * 100.0 / COUNT(game.id),
                     2)`,
              'winRate',)

              .groupBy(`
                CASE
                  WHEN player1.id = :characterId THEN player2.id
                  ELSE player1.id
                END
              `)

              .addGroupBy(`
                CASE
                  WHEN player1.id = :characterId THEN player2.name
                  ELSE player1.name
                END
              `)

              .orderBy('winRate', order)
              .addOrderBy('games', 'DESC')
              .limit(1);

              return query.getRawOne();

    }



    private async findCharacterCard(cardsDto: CardsDto, userId: number, order: 'ASC' | 'DESC'){

    const query = this.statsRepository.createQueryBuilder('game')
    .innerJoin('game.userRoster', 'roster')
    .innerJoin('roster.user', 'user')
    .innerJoin('roster.character', 'character')
    .where('user.id = :userId', { userId });

    if (cardsDto.online !== undefined) {
        query.andWhere('game.online = :online', {
            online: cardsDto.online,
        });
    }


    query.select('character.id', 'id')
         .addSelect('character.name', 'name')
         .addSelect('COUNT(game.id)', 'games')
         .addSelect('SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END)', 'wins',)
         .addSelect(`ROUND( SUM(CASE WHEN game.win = true THEN 1 ELSE 0 END) * 100.0 / COUNT(game.id), 2)`, 'winRate',)
         .groupBy('character.id')
         .addGroupBy('character.name')
             
        query.orderBy('winRate', order)
             .addOrderBy('games', 'DESC')
             .limit(1)

        return query.getRawOne();

    }

  }

