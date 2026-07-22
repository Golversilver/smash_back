import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRosterDto } from './dto/create-user-roster.dto';
import { Repository } from 'typeorm';
import { UserRoster } from './entities/user-roster.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/common/enum/status.enum';
import { UpdateUserRosterDto } from './dto/update-user-roster.dto';

@Injectable()
export class UserRosterService {

  constructor(
    @InjectRepository(UserRoster)
    private readonly rosterRepository: Repository<UserRoster>
  ){}

  async findMain(idUser: number){
    const existMain =  await this.rosterRepository.findOne({
       where:{
        user:{
          id: idUser
        },
        main: true,
        status: Status.ACTIVE
       }
    })

    return existMain;
  }

  async create(createUserRosterDto: CreateUserRosterDto, userId: number) {

    //BUSCA SI EXISTE YA UN REGISTRO
    const existUserRoster = await this.rosterRepository.findOne({
      where: {
        user:{
          id: userId
        },
        character: {
          id: createUserRosterDto.characterId
        },
      }
    })




    if (existUserRoster?.status == Status.ACTIVE) {
        throw new ConflictException('Character already exists in roster');
      }
    
    
    // Si será el nuevo main, quitar el main anterior
    if(createUserRosterDto.main){

    const existMain = await this.findMain(userId);

    if(existMain){
       existMain.main = false;
       await this.rosterRepository.save(existMain);
      }
    }

        
    if(existUserRoster){
      
      existUserRoster.status = Status.ACTIVE;

      if(createUserRosterDto.main === true){
         existUserRoster.main = true;
       }

       await this.rosterRepository.save(existUserRoster);

    }else{

      const roster = this.rosterRepository.create({
          main: createUserRosterDto.main,
          user: {
            id: userId,
          },
          character: {
            id: createUserRosterDto.characterId,
          },
      });

      await this.rosterRepository.save(roster);
    }

    //retornar mensaje
    return {
      message: 'creado exitosamente'
    }
  } //final  del create



      async findAll(userId: number) {
        return this.rosterRepository.find({
          where: {
            user: {
              id: userId,
            },
            status: Status.ACTIVE,
          },
          relations: {
            character: true,
          },
          order: {
            main: 'DESC',
          },
        });
      }


  async findOne(id: number,  userId: number) {
    
    const userRoster = await this.rosterRepository.findOne({
      where: {
        id: id,
        user:{
            id: userId,
        },
        status: Status.ACTIVE
      },
      relations: {
        character: true,
      },
    })

    if(!userRoster){
      throw new NotFoundException('Character not found')
    }

    return userRoster;
  }



 async update(id: number, updateUserRosterDto: UpdateUserRosterDto, userId: number) {

    if(updateUserRosterDto.main){
    const existMain = await this.findMain(userId);

    if(existMain && existMain.id != id){
      existMain.main = false;
      await this.rosterRepository.save(existMain);
    }
    }
    
    const roster = await this.findOne(id, userId);

    Object.assign(roster, updateUserRosterDto);

    return this.rosterRepository.save(roster);
  }




  async remove(id: number,  userId: number) {
    
   const userRoster = await this.findOne(id, userId);

   userRoster.status = Status.INACTIVE;
   userRoster.main = false;

   await this.rosterRepository.save(userRoster);

   return {
    message: 'User Roster Delete' 
   }

  }
}
