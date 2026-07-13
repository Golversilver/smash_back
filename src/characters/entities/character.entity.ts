
import { Match } from '../../matchs/entities/match.entity';
import { UserRoster } from '../../user-roster/entities/user-roster.entity';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('characters')
export class Character {
    
    @PrimaryGeneratedColumn('increment')
    id!: number;  

    @Column()
    name!: string;

    @OneToMany(
        () => UserRoster,
        (userRoster) => userRoster.character
    )
    userRoster!: UserRoster[];

    @OneToMany(
    () => Match,
    (match) => match.character1
    )
    matchesAsCharacter1!: Match[];

    @OneToMany(
    () => Match,
    (match) => match.character2
    )
    matchesAsCharacter2!: Match[];

}
