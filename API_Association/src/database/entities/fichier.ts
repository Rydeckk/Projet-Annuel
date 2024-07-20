import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GED } from "./ged";

@Entity({name: "Fichier"})
export class Fichier {
    @PrimaryGeneratedColumn()
    id: number

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    name: string

    @Column()
    type: string

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    path: string

    @ManyToOne(() => GED, ged => ged.files)
    ged: GED

    @ManyToOne(() => Fichier, fichier => fichier.folders, {onDelete: 'CASCADE', nullable: true})
    parentFolder: Fichier | null

    @OneToMany(() => Fichier, fichiers => fichiers.parentFolder, {onDelete: 'CASCADE'})
    folders: Fichier[]

    @CreateDateColumn({type:"datetime"})
    addedDate: Date

    constructor(id: number, name: string,type: string, path: string, ged: GED, parentFolder: Fichier | null, folders: Fichier[], addedDate: Date) {
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