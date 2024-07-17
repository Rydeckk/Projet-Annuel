import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";
import { Fichier } from "./fichier";

@Entity({name: "GED"})
export class GED {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => Association, association => association.ged)
    associations: Association[]

    @OneToMany(() => Fichier, files => files.ged)
    files: Fichier[]

    constructor(id: number, associations: Association[], files: Fichier[]) {
        this.id = id,
        this.associations = associations,
        this.files = files
    }
}