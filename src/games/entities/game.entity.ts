import { BaseEntity } from "../../common/entity/base.entity";
import { Status } from "../../common/enum/status.enum";
import { Match } from "../../matchs/entities/match.entity";
import { Stage } from "../../stages/entities/stage.entity";
import { UserRoster } from "../../user-roster/entities/user-roster.entity";
import { Column, ManyToOne, } from "typeorm";

import { Entity } from 'typeorm';

@Entity('games')
export class Game extends BaseEntity {

    @Column()
    online!: boolean;

    @Column()
    win!: boolean;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status!: Status;

    @ManyToOne(
        () => Stage, 
        (stage) => stage.games
    )
    stage!: Stage;
    
    @ManyToOne(
        () => Match,
        (match) => match.games
    )
    match!: Match;

    @ManyToOne(
    () => UserRoster,
    (userRoster) => userRoster.games
    )
    userRoster!: UserRoster;
    //idUser   n-1
}
