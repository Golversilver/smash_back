import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchNoteDto } from './dto/create-match-note.dto';
import { UpdateMatchNoteDto } from './dto/update-match-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchNote } from './entities/match-note.entity';
import { Repository } from 'typeorm';
import { SearchMatchNote } from './dto/search-match-note.dto';
import { MatchRosterValidationService } from 'src/common/services/match-roster-validation/match-roster-validation.service';

@Injectable()
export class MatchNotesService {

  constructor(
    @InjectRepository(MatchNote)
    private readonly matchNoteRepository: Repository<MatchNote>,
    private readonly matchRosterValidationService: MatchRosterValidationService
  ){}

  async create(createMatchNoteDto: CreateMatchNoteDto , matchId: number, rosterId:  number, userId: number) {

    const valid = await this.matchRosterValidationService.ensureSameCharacter(matchId, rosterId, userId);

    if(!valid){
      throw new BadRequestException('El personaje del roster no participa en el match.')
    }
     
    const RosterNote = this.matchNoteRepository.create({
      ...createMatchNoteDto,
      userRoster: {
        id: rosterId
      },
      match:{
        id: matchId
      }
    })

    return this.matchNoteRepository.save(RosterNote);
  }

  findAllPublic(matchId: number, rosterId: number) {
    return this.matchNoteRepository.find({
      where:{
        match: {
          id: matchId
        },
        userRoster: {
          id: rosterId
        },
      is_public: true 
      }
    })
  }


  findAll(searchMatchNote: SearchMatchNote ,matchId: number, rosterId: number,  userId: number) {
     
    const query = this.matchNoteRepository.createQueryBuilder('matchNote')
    .leftJoin('matchNote.userRoster', 'userRoster')
    .leftJoin('userRoster.user', 'user')
    .leftJoin('matchNote.match', 'match')
    .where('user.id = :userId', {userId})
    .andWhere('userRoster.id = :rosterId', {rosterId})
    .andWhere('match.id = :matchId', { matchId });

    if(searchMatchNote.search){
      query.andWhere(
        'matchNote.importance = :importance',
        {importance: searchMatchNote.search}
      );
    }

    query.orderBy(`
      CASE
        WHEN matchNote.importance = 'HIGH' THEN 1
        WHEN matchNote.importance = 'MEDIUM' THEN 2
        WHEN matchNote.importance = 'LOW' THEN 3
      END
      `);
    return query.getMany();
  }

  async findOne(id: number) {
    const note = await this.matchNoteRepository.findOneBy({id})

    if(!note){
      throw new NotFoundException('note not found')
    }

    return note;
  }

  async update(id: number, updateMatchNoteDto: UpdateMatchNoteDto, userId: number) {
    
    const matchNote = await this.matchNoteRepository.findOne({
      where: {
        userRoster:{
          user:{
            id: userId
          }
        },
        id: id
      }
    })

    if(!matchNote){
       throw new NotFoundException('La nota no existe');
    }

    Object.assign(matchNote, updateMatchNoteDto);

    return this.matchNoteRepository.save(matchNote);
  }

  async remove(id: number) {
    const note = await this.findOne(id);

    await this.matchNoteRepository.remove(note);
    
    return{
      message: 'Note Delete'
    }
  }
}
