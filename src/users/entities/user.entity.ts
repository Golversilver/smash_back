import * as bcrypt from 'bcrypt';
import { BaseEntity } from "../../common/entity/base.entity";
import { Exclude } from "class-transformer"
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { OneToMany } from "typeorm";
import { UserRoster } from '../../user-roster/entities/user-roster.entity';
import { Status } from '../../common/enum/status.enum';

@Entity('users')
export class User extends BaseEntity {

  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    this.email = this.email.trim().toLowerCase();
  } 

  @Exclude()
  @Column()
  password!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)  
  }


  @Column({
      type: 'enum',
      enum: Status,
      default: Status.ACTIVE,
      })
      status!: Status;

  
  @OneToMany(
    () => UserRoster,
    (userRoster) => userRoster.user
  )
  userRoster!: UserRoster[];
  
}
