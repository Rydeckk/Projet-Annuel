import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";
import { Vote } from "./vote";

@Entity({name: "Assemblee"})
export class Assemblee {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    location: string

    @Column()
    description: string

    @Column({type: "datetime"})
    beginDate: Date

    @Column({type: "datetime"})
    endDate: Date

    @ManyToOne(() => Association, asso => asso.assemblee)
    association: Association

    @OneToMany(() => Vote, vote => vote.assemblee)
    votes: Vote[]

    constructor(id: number, location: string, description: string, beginDate: Date, endDate: Date, association: Association, votes: Vote[]) {
        this.id = id,
        this.location = location,
        this.description = description,
        this.beginDate = beginDate,
        this.endDate = endDate,
        this.association = association,
        this.votes = votes
    }
}