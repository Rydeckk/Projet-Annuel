import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";
import { User } from "./user";

@Entity({name: "Planning"})
export class Planning {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({type: "datetime"})
    beginDate: Date

    @Column({type: "datetime"})
    endDate: Date

    @ManyToOne(() => Association, association => association.planning)
    association: Association

    @ManyToMany(() => User, user => user.planning)
    @JoinTable({name: "Taches_membre"})
    users: User[]

    constructor(id: number, title: string, beginDate: Date, endDate: Date, association: Association, users: User[]) {
        this.id = id,
        this.title = title,
        this.beginDate = beginDate,
        this.endDate = endDate,
        this.association = association,
        this.users = users
    }
}