import { Module } from '@nestjs/common';
import { RosterNotesService } from './roster-notes.service';
import { RosterNotesController } from './roster-notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RosterNote } from './entities/roster-note.entity';

@Module({
  controllers: [RosterNotesController],
  providers: [RosterNotesService],
  imports:[TypeOrmModule.forFeature([RosterNote])]
})
export class RosterNotesModule {}
