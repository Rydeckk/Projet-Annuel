import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { TypeAdhesion } from "./typeAdhesion";

@Entity({name: "Adhesion"})
export class Adhesion {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => User, user => user.adhesion, {onDelete: "CASCADE"})
    users: User[]

    @ManyToOne(() => TypeAdhesion, typeAdhesion => typeAdhesion.adhesions, {nullable: false})
    typeAdhesion: TypeAdhesion

    @Column({default: true})
    isActive: boolean

    @Column({type:"datetime"})
    beginDate: Date

    @Column({type: "datetime"})
    endDate: Date

    @CreateDateColumn({type:"datetime"})
    createdAt: Date

    constructor(id: number, users: User[], typeAdhesion: TypeAdhesion, isActive: boolean, beginDate: Date, endDate: Date, createdAt: Date) {
        this.id = id,
        this.users = users,
        this.typeAdhesion = typeAdhesion,
        this.isActive = isActive,
        this.beginDate = beginDate,
        this.endDate = endDate,
        this.createdAt = createdAt
    }

}