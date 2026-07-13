import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchStatsDto } from './dto/searchStats.dto';
import { WinRateDinamic } from './dto/winRateDinamic.dto';

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

  @Get('stages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({name: 'online',required: false,type: Boolean,description: 'Filtrar por online o presencial',})
  findStages(@Query() searchStatsDto: SearchStatsDto,
          @Req() request: Request & {user: any}) {
    return this.statsService.findStages(searchStatsDto , request.user.id);
  }


  @Get('matchs/:rosterId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({name: 'online',required: false,type: Boolean,description: 'Filtrar por online o presencial',})
  findMatchs(@Query() searchStatsDto: SearchStatsDto,
             @Req() request: Request & {user: any},
             @Param('rosterId') rosterId: string) {
    return this.statsService.findMatchs(searchStatsDto , request.user.id, +rosterId);
  }


  @Post('winRate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findWinRate(@Req() request: Request & {user: any},
             @Body() WinRateDinamic: WinRateDinamic) {
    return this.statsService.findWinRate(WinRateDinamic , request.user.id);
  }
}
