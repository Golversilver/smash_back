import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchsService } from './matchs.service';

@Controller('matchs')
export class MatchsController {
  constructor(private readonly matchsService: MatchsService) {}

  @Get()
  findAll() {
    return this.matchsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchsService.findOne(+id);
  }
}
