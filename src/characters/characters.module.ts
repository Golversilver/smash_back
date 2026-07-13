import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { CharactersController } from './characters.controller';
import { charactersService } from './characters.service';

@Module({
  controllers: [CharactersController],
  providers: [charactersService],
  imports: [
    TypeOrmModule.forFeature([Character])
  ]
})
export class CharactersModule {}
