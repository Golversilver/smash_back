import { Character } from "../../characters/entities/character.entity";
import { Game } from "../../games/entities/game.entity";
import { MatchNote } from "../../match-notes/entities/match-note.entity";
import { ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { Entity } from 'typeorm';

@Entity('matches')
@Unique(['character1', 'character2'])
export class Match {

    @PrimaryGeneratedColumn('increment')
    id!: number;      

    @OneToMany(
        () => Game,
        (game) => game.match 
    )
    games!: Game[];

    @OneToMany(
        () => MatchNote,
        (matchNote) => matchNote.match 
    )
    matchNotes!: MatchNote[];

    @ManyToOne(
        () => Character,
        (character) => character.matchesAsCharacter1
    )
    character1!: Character;

    @ManyToOne(
        () => Character,
        (character) => character.matchesAsCharacter2
    )
    character2!: Character;
}
