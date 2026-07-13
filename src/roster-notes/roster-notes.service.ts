import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRosterNoteDto } from './dto/create-roster-note.dto';
import { UpdateRosterNoteDto } from './dto/update-roster-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RosterNote } from './entities/roster-note.entity';
import { Repository } from 'typeorm';
import { SearchRosterNote } from './dto/search-roster-note.dto';
import { find } from 'rxjs';

@Injectable()
export class RosterNotesService {

  constructor(
    @InjectRepository(RosterNote)
    private readonly rosterNoteRepository: Repository<RosterNote>
  ){}

  create(createRosterNoteDto: CreateRosterNoteDto, rosterId: number) {
    const RosterNote = this.rosterNoteRepository.create({
      ...createRosterNoteDto,
      userRoster: {
        id: rosterId
      }
    })

    return this.rosterNoteRepository.save(RosterNote);
  }

  findAll(rosterId: number, searchRosterNote: SearchRosterNote , userId: number) {
 
    const query = this.rosterNoteRepository.createQueryBuilder('rosterNote')
    .leftJoin('rosterNote.userRoster', 'userRoster')
    .leftJoin('userRoster.user', 'user')
    .where('user.id = :userId', {userId})
    .andWhere('userRoster.id = :rosterId', {rosterId})

    if(searchRosterNote.search){
      query.andWhere(
        'rosterNote.importance = :importance',
        {importance: searchRosterNote.search}
      );
    }

    query.orderBy(`
      CASE
        WHEN rosterNote.importance = 'HIGH' THEN 1
        WHEN rosterNote.importance = 'MEDIUM' THEN 2
        WHEN rosterNote.importance = 'LOW' THEN 3
      END
      `);

    return query.getMany();
  }

  findAllPublic(rosterId: number) {
    return this.rosterNoteRepository.find({
      where: {
        userRoster: {
          id: rosterId
        },
        is_public: true
      }
    })
  }

  async findOne(id: number) {
    const note = await this.rosterNoteRepository.findOneBy({id});

    if(!note){
      throw new NotFoundException('Note not found')
    }

    return note;
  }

  async update(id: number, updateRosterNoteDto: UpdateRosterNoteDto, userId: number) {
    const rosterNote = await this.rosterNoteRepository.findOne({
      where: {
        userRoster:{
          user:{
            id: userId
          }
        },
        id: id
      }
    })

    if(!rosterNote){
       throw new NotFoundException('La nota no existe');
    }

    Object.assign(rosterNote, updateRosterNoteDto);

    return this.rosterNoteRepository.save(rosterNote);
  }


  async remove(id: number) {
    const note = await this.findOne(id);

    await this.rosterNoteRepository.remove(note);
    
    return{
      message: 'Note Delete'
    }
  }

}
