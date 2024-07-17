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
    colorText: string

    @Column({default: "#DDDDDD"})
    backgroundColor: string

    @OneToMany(() => Association, association => association.theme)
    associations: Association[]

    constructor(id: number, name: string, firstColor: string, colorText: string, backgroundColor: string, associations: Association[]) {
        this.id = id,
        this.name = name,
        this.firstColor = firstColor,
        this.colorText = colorText,
        this.backgroundColor = backgroundColor,
        this.associations = associations
    }
}