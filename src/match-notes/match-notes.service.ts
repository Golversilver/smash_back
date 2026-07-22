import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchNoteDto } from './dto/create-match-note.dto';
import { UpdateMatchNoteDto } from './dto/update-match-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchNote } from './entities/match-note.entity';
import { Repository } from 'typeorm';
import { SearchMatchNote } from './dto/search-match-note.dto';
import { MatchRosterValidationService } from 'src/common/services/match-roster-validation/match-roster-validation.service';
import { MatchsService } from 'src/matchs/matchs.service';
import { UserRosterService } from 'src/user-roster/user-roster.service';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MatchNotesService {

  constructor(
    @InjectRepository(MatchNote)
    private readonly matchNoteRepository: Repository<MatchNote>,
    private readonly matchRosterValidationService: MatchRosterValidationService,
    private readonly matchsService: MatchsService,
    private readonly userRosterService: UserRosterService,
  ){}

  async create(createMatchNoteDto: CreateMatchNoteDto , rivalId: number, rosterId:  number, userId: number) {

    const roster = await this.userRosterService.findOne(rosterId, userId);

    const match = await this.matchsService.searchMatch(roster.character.id, rivalId);
     
    const RosterNote = this.matchNoteRepository.create({
       ...createMatchNoteDto,
       userRoster: {
       id: rosterId
     },
       match:{
        id: match.id
       }
     })

     return this.matchNoteRepository.save(RosterNote);
  }

  async findAllPublic(rivalId: number, rosterId: number, userId: number, paginationQuery: PaginationQueryDto) {

    const { page, limit } = paginationQuery;

    const roster = await this.userRosterService.findOne(rosterId, userId);

    const match = await this.matchsService.searchMatch(roster.character.id, rivalId);

     const [notes, total] = await this.matchNoteRepository.findAndCount({
      where:{
        match: {
          id: match.id
        },
        userRoster: {
          character: {
            id: roster.character.id
          }
        },
      is_public: true,
      },

      skip: (page - 1) * limit,
      take: limit,
    })

    return {
    data: notes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    };
  }


  async findAll(searchMatchNote: SearchMatchNote, rivalId: number, rosterId: number,  userId: number) {

    const roster = await this.userRosterService.findOne(rosterId, userId);

    const match = await this.matchsService.searchMatch(roster.character.id, rivalId);
     
    const query = this.matchNoteRepository.createQueryBuilder('matchNote')
    .leftJoin('matchNote.userRoster', 'userRoster')
    .leftJoin('userRoster.user', 'user')
    .leftJoin('matchNote.match', 'match')
    .where('user.id = :userId', {userId})
    .andWhere('userRoster.id = :rosterId', {rosterId})
    .andWhere('match.id = :matchId', {  matchId: match.id });

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
