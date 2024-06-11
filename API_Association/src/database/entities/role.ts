import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { User } from "./user";
import { Association } from "./association";

@Entity({name: "Role"})
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({default: false})
    isMember: boolean

    @Column({default: false})
    isAdmin: boolean

    @Column({default: false})
    isSuperAdmin: boolean

    @OneToMany(() => User, user => user.role)
    users: User[];

    @ManyToOne(() => Association, association => association.roles, {nullable: false})
    association: Association

    constructor(id: number, name: string, isMember: boolean, isAdmin: boolean, isSuperAdmin: boolean, users: User[], association: Association) {
        this.id = id,
        this.name = name,
        this.isMember = isMember,
        this.isAdmin = isAdmin,
        this.isSuperAdmin = isSuperAdmin
        this.users = users,
        this.association = association
    }
}