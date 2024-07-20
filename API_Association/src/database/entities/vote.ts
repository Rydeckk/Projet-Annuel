import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reponse } from "./reponse";
import { Association } from "./association";
import { Assemblee } from "./assemblee";

@Entity({name: "Vote"})
export class Vote {
    @PrimaryGeneratedColumn()
    id: number

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    name: string

    @Column({type: "datetime"})
    beginDate: Date

    @Column({type: "datetime"})
    endDate: Date

    @OneToMany(() => Reponse, reponse => reponse.vote)
    reponses: Reponse[]

    @ManyToOne(() => Association, association => association.votes)
    association: Association

    @ManyToOne(() => Assemblee, assemblee => assemblee.votes, {nullable: true})
    assemblee: Assemblee

    @OneToOne(() => Vote, vote => vote.childVote)
    @JoinColumn()
    parentVote: Vote | null

    @OneToOne(() => Vote, vote => vote.parentVote)
    childVote: Vote

    constructor(id: number, name: string, beginDate: Date, endDate: Date, reponses: Reponse[], association: Association, assemblee: Assemblee, parentVote: Vote | null, childVote: Vote) {
        this.id = id,
        this.name = name,
        this.beginDate = beginDate,
        this.endDate = endDate,
        this.reponses = reponses,
        this.association = association,
        this.assemblee = assemblee,
        this.parentVote = parentVote,
        this.childVote = childVote
    }
}