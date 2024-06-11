import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GED } from "./ged";
import { DocumentGED } from "./document";

@Entity({name: "Dossier"})
export class Dossier {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    path: string

    @ManyToOne(() => GED, ged => ged.documents)
    ged: GED

    @OneToMany(() => DocumentGED, document => document.folder)
    files: DocumentGED[]

    @CreateDateColumn({type:"datetime"})
    addedDate: Date

    constructor(id: number, name: string, path: string, ged: GED, files: DocumentGED[], addedDate: Date) {
        this.id = id,
        this.name = name,
        this.path = path,
        this.ged = ged,
        this.files = files,
        this.addedDate = addedDate
    }
}