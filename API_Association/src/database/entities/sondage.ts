import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reponse } from "./reponse";
import { Association } from "./association";

@Entity({name: "Sondage"})
export class Sondage {
    @PrimaryGeneratedColumn()
    id: number

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    name: string

    @Column({type: "datetime"})
    beginDate: Date

    @Column({type: "datetime"})
    endDate: Date

    @OneToMany(() => Reponse, reponse => reponse.sondage, {onDelete: "CASCADE"})
    reponses: Reponse[]

    @ManyToOne(() => Association, association => association.sondages)
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