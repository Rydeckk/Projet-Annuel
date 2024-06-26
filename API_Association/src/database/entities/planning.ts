import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";
import { User } from "./user";

@Entity({name: "Planning"})
export class Planning {
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: ""})
    title: string

    @Column({type: "date"})
    date: Date

    @Column({default: ""})
    location: string

    @Column({type: "time"})
    start_time: string

    @Column({type: "time"})
    end_time: string

    @Column({default: ""})
    calendar_name: string

    @ManyToOne(() => Association, association => association.planning)
    association: Association

    @ManyToMany(() => User, user => user.planning)
    @JoinTable({name: "Taches_membre"})
    users: User[]

    constructor(id: number, title: string, date: Date, location: string ,start_time: string, end_time: string, calendar_name: string, association: Association, users: User[]) {
        this.id = id,
        this.title = title,
        this.date = date,
        this.location = location,
        this.start_time = start_time,
        this.end_time = end_time,
        this.calendar_name = calendar_name,
        this.association = association,
        this.users = users
    }
}