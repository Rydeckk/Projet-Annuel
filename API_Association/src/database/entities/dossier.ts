import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GED } from "./ged";
import { DocumentGED } from "./document";

@Entity({name: "Dossier"})
export class Dossier {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => GED, ged => ged.documents)
    ged: GED

    @ManyToOne(() => Dossier, dossier => dossier.folders)
    parentFolder: Dossier

    @OneToMany(() => Dossier, dossiers => dossiers.parentFolder)
    folders: Dossier[]

    @OneToMany(() => DocumentGED, document => document.folder)
    files: DocumentGED[]

    @CreateDateColumn({type:"datetime"})
    addedDate: Date

    constructor(id: number, name: string, ged: GED, parentFolder: Dossier, folders: Dossier[], files: DocumentGED[], addedDate: Date) {
        this.id = id,
        this.name = name,
        this.ged = ged,
        this.parentFolder = parentFolder,
        this.folders = folders,
        this.files = files,
        this.addedDate = addedDate
    }
}