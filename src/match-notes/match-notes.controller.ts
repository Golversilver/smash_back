import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { MatchNotesService } from './match-notes.service';
import { CreateMatchNoteDto } from './dto/create-match-note.dto';
import { UpdateMatchNoteDto } from './dto/update-match-note.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchMatchNote } from './dto/search-match-note.dto';

@Controller('match-notes')
export class MatchNotesController {
  constructor(private readonly matchNotesService: MatchNotesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':matchId/roster/:rosterId')
  create(@Body() createMatchNoteDto: CreateMatchNoteDto,
         @Param('matchId', ParseIntPipe) matchId:number,
         @Param('rosterId', ParseIntPipe) rosterId:number,
         @Req() request: Request & {user: any}){
    return this.matchNotesService.create(createMatchNoteDto, matchId, rosterId, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':matchId/roster/:rosterId')
  findAll( @Query() searchMatchNote: SearchMatchNote,
           @Param('matchId', ParseIntPipe) matchId:number,
           @Param('rosterId', ParseIntPipe) rosterId:number,
           @Req() request: Request & {user: any}) {
    return this.matchNotesService.findAll(searchMatchNote, matchId, rosterId, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':matchId/roster/:rosterId/public')
  findAllPublic( @Param('matchId', ParseIntPipe) matchId:number,
                 @Param('rosterId', ParseIntPipe) rosterId:number) {
    return this.matchNotesService.findAllPublic(matchId, rosterId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchNotesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchNoteDto: UpdateMatchNoteDto,
         @Req() request: Request & {user: any}) {

    return this.matchNotesService.update(+id, updateMatchNoteDto, request.user.id);
  }

   
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchNotesService.remove(+id);
  }
}
