import { InjectRepository } from "@nestjs/typeorm";
import { Character } from "./entities/character.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

export class charactersService{

    constructor(
        @InjectRepository(Character)
        private readonly characterRepository: Repository<Character>
    ){}

    async findAll(){
        return this.characterRepository.find();
    }


    async findAvailable(userId: number){
  
        return this.characterRepository.createQueryBuilder('character')
               .leftJoin('character.userRoster','roster','roster.userId = :userId',{ userId })
               .where('roster.id IS NULL')
               .getMany();

    }

    
    async findOne(id: number) {
        const characters = this.characterRepository.findOneBy({id})

        if(!characters){
            throw new NotFoundException('Character not found')
        }

        return characters;
    }

}