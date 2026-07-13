import { Status } from "../../common/enum/status.enum";
import { Character } from "../../characters/entities/character.entity";
import { BaseEntity } from "../../common/entity/base.entity";
import { Game } from "../../games/entities/game.entity";
import { MatchNote } from "../../match-notes/entities/match-note.entity";
import { RosterNote } from "../../roster-notes/entities/roster-note.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, Unique } from "typeorm";

@Entity('userRoster')
@Unique(['user', 'character'])
export class UserRoster extends BaseEntity {

    @Column()
    main!: boolean

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status!: Status;

    @OneToMany(
        () => Game,
        (game) => game.userRoster
    )
    games!: Game[];

    @OneToMany(
        () => RosterNote,
        (rosterNote) => rosterNote.userRoster
    )
    rosterNotes!: RosterNote[];

    @OneToMany(
        () => MatchNote,
        (matchNote) => matchNote.userRoster
    )
    matchNotes!: MatchNote[];

    @ManyToOne(
        () => User,
        (user) => user.userRoster
    )
    user!: User;

    @ManyToOne(
        () => Character,
        (character) => character.userRoster
    )
    character!: Character;

    //idCharacter
}
