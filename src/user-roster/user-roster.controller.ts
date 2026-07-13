import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserRosterService } from './user-roster.service';
import { CreateUserRosterDto } from './dto/create-user-roster.dto';
import { UpdateUserRosterDto } from './dto/update-user-roster.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user-roster')
export class UserRosterController {
  constructor(private readonly userRosterService: UserRosterService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createUserRosterDto: CreateUserRosterDto,
         @Req() request: Request & {user: any}) {
    return this.userRosterService.create(createUserRosterDto, request.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Req() request: Request & {user: any}) {
    return this.userRosterService.findAll(request.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string,
          @Req() request: Request & {user: any}) {
    return this.userRosterService.findOne(+id, request.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserRosterDto: UpdateUserRosterDto,
         @Req() request: Request & {user: any}) {
    return this.userRosterService.update(+id, updateUserRosterDto, request.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string,
         @Req() request: Request & {user: any}) {
    return this.userRosterService.remove(+id, request.user.id);
  }
}
