import { Game } from "../../games/entities/game.entity";
import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from 'typeorm';

@Entity('stages')
export class Stage {
    @PrimaryGeneratedColumn('increment')
    id!: number;  

    @Column()
    name!: string;

    @OneToMany(
        () => Game,
        (game) => game.stage
    )
    games!: Game[];
}

