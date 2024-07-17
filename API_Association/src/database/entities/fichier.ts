import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GED } from "./ged";

@Entity({name: "Fichier"})
export class Fichier {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    type: string

    @Column()
    path: string

    @ManyToOne(() => GED, ged => ged.files)
    ged: GED

    @ManyToOne(() => Fichier, fichier => fichier.folders, {onDelete: 'CASCADE'})
    parentFolder: Fichier

    @OneToMany(() => Fichier, fichiers => fichiers.parentFolder, {onDelete: 'CASCADE'})
    folders: Fichier[]

    @CreateDateColumn({type:"datetime"})
    addedDate: Date

    constructor(id: number, name: string,type: string, path: string, ged: GED, parentFolder: Fichier, folders: Fichier[], addedDate: Date) {
        this.id = id,
        this.name = name,
        this.type = type,
        this.path = path,
        this.ged = ged,
        this.parentFolder = parentFolder,
        this.folders = folders,
        this.addedDate = addedDate
    }
}