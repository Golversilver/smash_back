import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe, Query } from '@nestjs/common';
import { RosterNotesService } from './roster-notes.service';
import { CreateRosterNoteDto } from './dto/create-roster-note.dto';
import { UpdateRosterNoteDto } from './dto/update-roster-note.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SearchRosterNote } from './dto/search-roster-note.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Controller('roster-notes')
export class RosterNotesController {
  constructor(private readonly rosterNotesService: RosterNotesService) {}

  @Post(':rosterId/notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createRosterNoteDto: CreateRosterNoteDto,
         @Param('rosterId', ParseIntPipe) rosterId:number) {
    return this.rosterNotesService.create(createRosterNoteDto, rosterId);
  }

  @Get(':rosterId/notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Query() searchRosterNote: SearchRosterNote,
          @Req() request: Request & {user: any},
          @Param('rosterId', ParseIntPipe) rosterId:number  
        ) {
    return this.rosterNotesService.findAll(rosterId ,searchRosterNote, request.user.id);
  }

  @Get(':rosterId/public')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAllPublic(@Param('rosterId', ParseIntPipe) rosterId:number,
                @Query() paginationQuery: PaginationQueryDto,
                @Req() request: Request & {user: any}) {
    return this.rosterNotesService.findAllPublic(rosterId, paginationQuery, request.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.rosterNotesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateRosterNoteDto: UpdateRosterNoteDto,
         @Req() request: Request & {user: any},) {
    return this.rosterNotesService.update(+id, updateRosterNoteDto, request.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.rosterNotesService.remove(+id);
  }
}
