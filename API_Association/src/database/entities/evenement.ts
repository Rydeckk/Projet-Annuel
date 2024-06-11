import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";
import { User } from "./user";

@Entity({name: "Evenement"})
export class Evenement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    type: string

    @Column({default: false})
    isPublic: boolean

    @Column({type: "datetime"})
    beginDate: Date

    @Column({type: "datetime"})
    endDate: Date

    @ManyToOne(() => Association, association => association.evenements)
    association: Association

    @ManyToMany(() => User, user => user.evenements)
    @JoinTable({name: "Participants"})
    attendees: User[]

    constructor(id: number, name: string, type: string, isPublic: boolean, beginDate: Date, endDate: Date, association: Association, attendees: User[]) {
        this.id = id,
        this.name = name,
        this.type = type,
        this.isPublic = isPublic,
        this.beginDate = beginDate,
        this.endDate = endDate,
        this.association = association,
        this.attendees = attendees
    }
}