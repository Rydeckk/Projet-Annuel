import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";
import { DocumentGED } from "./document";

@Entity({name: "GED"})
export class GED {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => Association, association => association.ged)
    associations: Association[]

    @OneToMany(() => DocumentGED, document => document.ged)
    documents: DocumentGED[]

    constructor(id: number, associations: Association[], documents: DocumentGED[]) {
        this.id = id,
        this.associations = associations,
        this.documents = documents
    }
}