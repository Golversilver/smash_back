import { Injectable, NotFoundException } from '@nestjs/common';
import { Match } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MatchsService {

  constructor(   
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>
  ){}


  findAll() {
    return this.matchRepository.find({
    relations: {
      character1: true,
      character2: true
    }
  });
  }

  async findOne(id: number) {
   const match = await this.matchRepository.findOne({
    where: {
      id: id,
    },
    relations: {
      character1: true,
      character2: true
    }
   });

   if(!match){
    throw new NotFoundException('Match not found')
   }

   return match;
  }

  async searchMatch(characterPlayer: number, characterRival: number){

    const character1 = Math.min(characterPlayer, characterRival);
    const character2 = Math.max(characterPlayer, characterRival);

    const match = await this.matchRepository.findOne({
       where:{
        character1:{
          id: character1
        },
        character2:{
          id: character2
        }
       }
    });

    if(!match){
      throw new NotFoundException('Match no encontrado');
    }

    return match;

  }

}
