import { BaseEntity } from "../../common/entity/base.entity";
import { Importance } from "../../common/enum/importance.enum";
import { Match } from "../../matchs/entities/match.entity";
import { UserRoster } from "../../user-roster/entities/user-roster.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('matchNotes')
export class MatchNote extends BaseEntity {

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({
      type: 'enum',
      enum: Importance
    })
    importance!: Importance;

    @Column()
    is_public!: boolean;


    @ManyToOne(
        () => UserRoster,
        (userRoster) => userRoster.matchNotes
      )
      userRoster!: UserRoster;

    @ManyToOne(
        () => Match,
        (match) => match.matchNotes
      )
      match!: Match;

    //idMatch
}
