import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vote } from "./vote";
import { User } from "./user";

@Entity({name: "Reponse"})
export class Reponse {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({default:0 })
    nbVote: number = 0

    @ManyToOne(() => Vote, vote => vote.reponses)
    vote: Vote

    @ManyToOne(() => User, user => user.applicants, {nullable: true})
    applicant: User

    @ManyToMany(() => User, user => user.votes)
    @JoinTable({name: "Votes"})
    voters: User[]

    constructor(id: number, name: string, vote: Vote, applicant: User ,voters: User[]) {
        this.id = id,
        this.name = name,
        this.vote = vote,
        this.applicant = applicant
        this.voters = voters
    }
}