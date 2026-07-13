import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Status } from 'src/common/enum/status.enum';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ){}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email: email.trim().toLowerCase(),
        status: Status.ACTIVE
      },
    });
  }


  async create(createUserDto: CreateUserDto) {
    
    const existingUser = await this.findByEmail(createUserDto.email)

    if(existingUser){
        throw new ConflictException('Email already exists');
    }

    const user = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(user);

    return user
   
  }

  findAll() {
    return this.usersRepository.find({
      where: {
        status: Status.ACTIVE
      }
    });
  }

  async findOne(id: number) {
     const user = await this.usersRepository.findOneBy({
      id,
     })

     if(!user){
        throw new NotFoundException('User not found')
     }

     return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    
    if (updateUserDto.email){
       const existingUser = await this.findByEmail(updateUserDto.email)

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    if(updateUserDto.password){
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        10
      )
    }

    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    user.status = Status.INACTIVE;

    await this.usersRepository.save(user);

    return {
      message: 'user deleted'
    }
  }
}
