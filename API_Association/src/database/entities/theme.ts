import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";

@Entity({name: "Theme"})
export class Theme {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({default: "#000000"})
    firstColor: string

    @Column({default: "#FFFFFF"})
    secondColor: string

    @OneToMany(() => Association, association => association.theme)
    associations: Association[]

    constructor(id: number, name: string, firstColor: string, secondColor: string, associations: Association[]) {
        this.id = id,
        this.name = name,
        this.firstColor = firstColor,
        this.secondColor = secondColor,
        this.associations = associations
    }
}