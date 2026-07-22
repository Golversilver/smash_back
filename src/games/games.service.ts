import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Status } from 'src/common/enum/status.enum';
import { MatchRosterValidationService } from 'src/common/services/match-roster-validation/match-roster-validation.service';
import { MatchsService } from 'src/matchs/matchs.service';
import { UserRosterService } from 'src/user-roster/user-roster.service';
import { FindAllDto } from './dto/findAll.dto';

@Injectable()
export class GamesService {

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly matchRosterValidationService: MatchRosterValidationService,
    private readonly matchsService: MatchsService,
    private readonly userRosterService: UserRosterService
  ){}

  

  async create(createGameDto: CreateGameDto, userId: number) {

    const roster = await this.userRosterService.findOne(createGameDto.userRosterId, userId);

    const match = await this.matchsService.searchMatch(roster.character.id, createGameDto.characterRival);

    const game = this.gameRepository.create({
       online: createGameDto.online,
       win: createGameDto.win,
       match:{
         id: match.id
       },
       userRoster: {
         id: createGameDto.userRosterId
       },
       stage: {
         id: createGameDto.stageId
       }
    })

    return this.gameRepository.save(game);
    
  }

  async findAll(userId: number, findAllDto: FindAllDto) {

    const { page, limit, userRosterId, online} = findAllDto;

    const where: FindOptionsWhere<Game> = {
      userRoster: {
        user: {
          id: userId,
        },
      },
    };

    if (userRosterId !== undefined) {
      where.userRoster = {
        user: {
          id: userId,
        },
        id: userRosterId,
      };
    }

    if (online !== undefined) {
      where.online = online;
    }
    
    const [games, total] = await this.gameRepository.findAndCount({
      where,
      relations: {
        userRoster: {
          character: true,
        },
        match: {
          character1: true,
          character2: true,
        },
        stage: true,
      },
      order: {
        id: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

     
    return {
    data: games,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    };

  }

async findOne(id: number) {
  const game = await this.gameRepository.findOne({
    where: { id },
    relations: {
      match: true,
      userRoster: true,
      stage: true,
    },
  });

  if (!game) {
    throw new NotFoundException('Game not found');
  }

  return game;
}

  async update(id: number, updateGameDto: UpdateGameDto, userId: number) {

    const game = await this.findOne(id);

    const hasPlayer = updateGameDto.userRosterId !== undefined;
    const hasRival = updateGameDto.characterRival !== undefined;

    if (hasPlayer !== hasRival) {
      throw new BadRequestException(
        'Para modificar el enfrentamiento debes enviar ambos personajes.',
      );
    }

    let matchId = game.match.id;

     if (hasPlayer && hasRival) {

     const roster = await this.userRosterService.findOne( updateGameDto.userRosterId!, userId);

    const match = await this.matchsService.searchMatch(
     roster.character.id,
      updateGameDto.characterRival!,
    );

    matchId = match.id;
    game.match = match;
    }

    const userRosterId = updateGameDto.userRosterId ?? game.userRoster.id;
  
    const valid = await this.matchRosterValidationService.ensureSameCharacter(matchId, userRosterId, userId);

    if(!valid){
      throw new BadRequestException('El personaje del roster no participa en el match.')
    }

    Object.assign(game, updateGameDto);

    return this.gameRepository.save(game);
  }


  async remove(id: number) {
    const game  = await this.findOne(id);

    game.status = Status.INACTIVE;

    await this.gameRepository.save(game);

    return{
      menssage: 'game Deleted'
    }
  }
}
