import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ){}

  async login(loginDto: LoginDto) {
     const user = await this.usersService.findByEmail(
      loginDto.email
     )

     if(!user){
        throw new UnauthorizedException(
          'Invalid credentials'
        )
     }

     const IsAuthorized = await bcrypt.compare(
      loginDto.password,
      user.password 
     )
  
     if(!IsAuthorized){
        throw new UnauthorizedException(
        'Invalid credentials',
        );
     }

     const payload = {
      sub: user.id
     }

     const accessToken = await this.jwtService.signAsync(payload);

     return{
     accessToken
     }
  }


 async register(createAuthDto: CreateAuthDto) {

    const user = await this.usersService.create(createAuthDto);

    const payload = {
      sub: user.id
     }

    const accessToken = await this.jwtService.signAsync(payload);

     return{
      accessToken
     }
  }

}
