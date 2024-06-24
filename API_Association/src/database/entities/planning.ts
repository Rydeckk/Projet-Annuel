import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";
import { User } from "./user";

@Entity({name: "Planning"})
export class Planning {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({type: "date"})
    date: Date

    @Column({type: "time"})
    start_time: string

    @Column({type: "time"})
    end_time: string

    @ManyToOne(() => Association, association => association.planning)
    association: Association

    @ManyToMany(() => User, user => user.planning)
    @JoinTable({name: "Taches_membre"})
    users: User[]

    constructor(id: number, title: string, date: Date, start_time: string, end_time: string, association: Association, users: User[]) {
        this.id = id,
        this.title = title,
        this.date = date,
        this.start_time = start_time,
        this.end_time = end_time,
        this.association = association,
        this.users = users
    }
}