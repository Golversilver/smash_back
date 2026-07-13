import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stage } from './entities/stage.entity';
import { throwError } from 'rxjs';

@Injectable()
export class StagesService {

  constructor(
    @InjectRepository(Stage)
    private readonly stageRepository
  ){}

  findAll() {
    return this.stageRepository.find();
  }

  findOne(id: number) {
    const stages = this.stageRepository.findOneBy({id})

    if(!stages){
      throw  new NotFoundException('stage no found')
    }
  }
}
