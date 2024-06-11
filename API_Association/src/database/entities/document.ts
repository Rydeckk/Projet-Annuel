import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GED } from "./ged";
import { Dossier } from "./dossier";

@Entity({name: "DocumentGED"})
export class DocumentGED {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    path: string

    @ManyToOne(() => Dossier, dossier => dossier.files)
    folder: Dossier

    @ManyToOne(() => GED, ged => ged.documents)
    ged: GED

    @CreateDateColumn({type:"datetime"})
    addedDate: Date

    constructor(id: number, name: string, path: string, folder: Dossier, isFolder: boolean, ged: GED, addedDate: Date) {
        this.id = id,
        this.name = name,
        this.path = path,
        this.folder = folder,
        this.ged = ged,
        this.addedDate = addedDate
    }
}