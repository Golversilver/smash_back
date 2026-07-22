import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchStatsDto } from './dto/searchStats.dto';
import { WinRateDinamic } from './dto/winRateDinamic.dto';
import { CardsDto } from './dto/cards.dto';
import { StagesStatsDto } from './dto/stagesStats.dto';
import { MatchStatsDto } from './dto/matchStatsDto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('roster')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({name: 'online',required: false,type: Boolean,description: 'Filtrar por online o presencial',})
  findGames(@Query() searchStatsDto: SearchStatsDto,
          @Req() request: Request & {user: any}) {
    return this.statsService.findGames(searchStatsDto , request.user.id);
  }

  @Post('stages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findStages(@Body() stagesStatsDto: StagesStatsDto,
          @Req() request: Request & {user: any}) {
    return this.statsService.findStages(stagesStatsDto , request.user.id);
  }


  @Get('matchs/:rosterId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({name: 'online',required: false,type: Boolean,description: 'Filtrar por online o presencial',})
  findMatchs(@Query() matchStatsDto: MatchStatsDto,
             @Req() request: Request & {user: any},
             @Param('rosterId') rosterId: string) {
    return this.statsService.findMatchs(matchStatsDto , request.user.id, +rosterId);
  }


  @Post('winRate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findWinRate(@Req() request: Request & {user: any},
             @Body() WinRateDinamic: WinRateDinamic) {
    return this.statsService.findWinRate(WinRateDinamic , request.user.id);
  }


  @Post('cards')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getcards(@Req() request: Request & {user: any},
             @Body() cardsDto: CardsDto) {
    return this.statsService.getCards(cardsDto , request.user.id);
  }
}
