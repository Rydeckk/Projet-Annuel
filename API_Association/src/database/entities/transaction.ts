import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Association } from "./association";

@Entity({name: "Transaction"})
export class CompteTransaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    montant: number

    @Column()
    type: string

    @CreateDateColumn({type: "datetime"})
    didAt: Date

    @ManyToOne(() => Association, association => association.transactions)
    association: Association

    @ManyToOne(() => User, user => user.transactions)
    user: User

    constructor(id: number, montant: number, type: string, didAt: Date, association: Association, user: User) {
        this.id = id,
        this.montant = montant,
        this.type = type,
        this.didAt = didAt,
        this.association = association,
        this.user = user
    }
}