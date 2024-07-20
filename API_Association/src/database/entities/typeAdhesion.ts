import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";
import { Adhesion } from "./adhesion";

@Entity({name: "TypeAdhesion"})
export class TypeAdhesion {
    @PrimaryGeneratedColumn()
    id: number

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    type: string

    @Column()
    montant: number

    @ManyToOne(() => Association, association => association.typeAdhesions, {nullable: false})
    association: Association

    @OneToMany(() => Adhesion, adhesion => adhesion.typeAdhesion)
    adhesions: Adhesion[]

    constructor(id: number, type: string, montant: number, association: Association, adhesions: Adhesion[]) {
        this.id = id,
        this.type = type,
        this.montant = montant,
        this.association = association,
        this.adhesions = adhesions
    }
}