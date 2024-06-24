import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GED } from "./ged";
import { Dossier } from "./dossier";

@Entity({name: "DocumentGED"})
export class DocumentGED {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => Dossier, dossier => dossier.files)
    folder: Dossier

    @ManyToOne(() => GED, ged => ged.documents)
    ged: GED

    @CreateDateColumn({type:"datetime"})
    addedDate: Date

    constructor(id: number, name: string, folder: Dossier, ged: GED, addedDate: Date) {
        this.id = id,
        this.name = name,
        this.folder = folder,
        this.ged = ged,
        this.addedDate = addedDate
    }
}