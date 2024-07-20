import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, ManyToMany } from "typeorm"
import { Token } from "./token"
import { Role } from "./role"
import { Association } from "./association"
import { Materiel } from "./materiel"
import { CompteTransaction } from "./transaction"
import { Adhesion } from "./adhesion"
import { Evenement } from "./evenement"
import { Reponse } from "./reponse"
import { Planning } from "./planning"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    email: string

    @Column()
    password: string

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    firstName: string

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    lastName: string

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    address: string

    @ManyToOne(() => Role, role => role.users)
    role: Role

    @ManyToOne(() => Association, association => association.users, {nullable: true})
    association: Association

    @ManyToOne(() => Adhesion, adhesion => adhesion.users, {onDelete: 'CASCADE'})
    adhesion: Adhesion

    @CreateDateColumn({type: "datetime"})
    createdAt: Date

    @OneToMany(() => Token, token => token.user, {onDelete: 'CASCADE'})
    tokens: Token[]

    @OneToMany(() => CompteTransaction, transaction => transaction.user, {onDelete: 'CASCADE'})
    transactions: CompteTransaction[]

    @OneToMany(() => Materiel, materiel => materiel.user)
    materiels: Materiel[]

    @OneToMany(() => Reponse, reponse => reponse.applicants)
    applicants: Reponse[]

    @ManyToMany(() => Evenement, evenement => evenement.attendees)
    evenements: Evenement[]

    @ManyToMany(() => Reponse, reponse => reponse.voters)
    votes: Reponse[]

    @ManyToMany(() => Planning, planning => planning.users)
    planning: Planning[]

    constructor(id: number, email: string, password: string, firstName: string, lastName: string, address: string, role: Role, association: Association , 
        adhesion: Adhesion, createdAt: Date, tokens: Token[], transactions: CompteTransaction[], materiels: Materiel[], applicants: Reponse[] ,
        evenements: Evenement[], votes: Reponse[], planning: Planning[]) {
            this.id = id,
            this.email = email,
            this.password = password,
            this.firstName = firstName,
            this.lastName = lastName,
            this.address = address,
            this.role = role,
            this.association = association,
            this.adhesion = adhesion,
            this.createdAt = createdAt,
            this.tokens = tokens,
            this.transactions = transactions,
            this.materiels = materiels,
            this.applicants = applicants,
            this.evenements = evenements,
            this.votes = votes,
            this.planning = planning
    }
}