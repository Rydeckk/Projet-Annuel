import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reponse } from "./reponse";
import { Association } from "./association";

@Entity({name: "Vote"})
export class Vote {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({type: "datetime"})
    beginDate: Date

    @Column({type: "datetime"})
    endDate: Date

    @OneToMany(() => Reponse, reponse => reponse.vote)
    reponses: Reponse[]

    @ManyToOne(() => Association, association => association.votes)
    association: Association

    constructor(id: number, name: string, beginDate: Date, endDate: Date, reponses: Reponse[], association: Association) {
        this.id = id,
        this.name = name,
        this.beginDate = beginDate,
        this.endDate = endDate,
        this.reponses = reponses,
        this.association = association
    }
}