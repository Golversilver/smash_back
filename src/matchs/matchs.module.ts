import { Module } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { MatchsController } from './matchs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';

@Module({
  controllers: [MatchsController],
  providers: [MatchsService],
  imports: [TypeOrmModule.forFeature([Match])],
  exports: [MatchsService]
})
export class MatchsModule {}
