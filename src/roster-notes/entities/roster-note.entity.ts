import { BaseEntity } from "../../common/entity/base.entity";
import { Importance } from "../../common/enum/importance.enum";
import { UserRoster } from "../../user-roster/entities/user-roster.entity";
import { Column, ManyToOne } from "typeorm";

import { Entity } from 'typeorm';

@Entity('rosterNotes')
export class RosterNote extends BaseEntity{

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
          (userRoster) => userRoster.rosterNotes
        )
        userRoster!: UserRoster;
}
