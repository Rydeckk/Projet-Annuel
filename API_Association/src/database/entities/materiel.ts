import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";
import { User } from "./user";

@Entity({name: "Materiel"})
export class Materiel {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    type: string

    @ManyToOne(() => Association, association => association.materiels)
    association: Association

    @ManyToOne(() => User, user => user.materiels, {nullable: true})
    user: User

    constructor(id: number, name: string, type: string, association: Association, user: User) {
        this.id = id,
        this.name = name,
        this.type = type,
        this.association = association,
        this.user = user
    }
}