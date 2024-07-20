import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Sondage } from "./sondage";
import { Vote } from "./vote";

@Entity({name: "Reponse"})
export class Reponse {
    @PrimaryGeneratedColumn()
    id: number

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    name: string

    @Column({default:0 })
    nbVote: number = 0

    @ManyToOne(() => Vote, vote => vote.reponses)
    vote: Vote

    @ManyToOne(() => Sondage, sondage => sondage.reponses)
    sondage: Sondage

    @ManyToMany(() => User, user => user.applicants, {nullable: true})
    @JoinTable({name: "Candidats"})
    applicants: User[]

    @ManyToMany(() => User, user => user.votes)
    @JoinTable({name: "Votes"})
    voters: User[]

    constructor(id: number, name: string, vote: Vote, sondage: Sondage ,applicants: User[] ,voters: User[]) {
        this.id = id,
        this.name = name,
        this.vote = vote,
        this.sondage = sondage,
        this.applicants = applicants
        this.voters = voters
    }
}