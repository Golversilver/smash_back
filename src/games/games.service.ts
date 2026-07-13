import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { Status } from 'src/common/enum/status.enum';
import { MatchRosterValidationService } from 'src/common/services/match-roster-validation/match-roster-validation.service';
import { MatchsService } from 'src/matchs/matchs.service';

@Injectable()
export class GamesService {

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly matchRosterValidationService: MatchRosterValidationService,
    private readonly matchsService: MatchsService
  ){}

  

  async create(createGameDto: CreateGameDto, userId: number) {

    const match = await this.matchsService.searchMatch(createGameDto.characterPlayer, createGameDto.characterRival)

    const valid = await this.matchRosterValidationService.ensureSameCharacter(match.id, createGameDto.userRosterId, userId);

    if(!valid){
        throw new BadRequestException('El personaje del roster no participa en el match.')
    }

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

  findAll(userId: number) {
    return this.gameRepository.find({
      where: {
        userRoster: {
          user: {
              id: userId
          }
        }
      },
      order:{
        id:'DESC'
      }
    })
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

    const hasPlayer = updateGameDto.characterPlayer !== undefined;
    const hasRival = updateGameDto.characterRival !== undefined;

    if (hasPlayer !== hasRival) {
      throw new BadRequestException(
        'Para modificar el enfrentamiento debes enviar ambos personajes.',
      );
    }

    let matchId = game.match.id;

     if (hasPlayer && hasRival) {
    const match = await this.matchsService.searchMatch(
      updateGameDto.characterPlayer!,
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
