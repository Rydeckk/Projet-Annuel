import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Theme } from "./theme";
import { Local } from "./local";
import { Materiel } from "./materiel";
import { CompteTransaction } from "./transaction";
import { TypeAdhesion } from "./typeAdhesion";
import { GED } from "./ged";
import { Evenement } from "./evenement";
import { Role } from "./role";
import { Vote } from "./vote";

@Entity({name: "Association"})
export class Association {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column({unique: true})
    domainName: string

    @OneToMany(() => User, user => user.association, {onDelete: 'CASCADE'})
    users: User[]

    @OneToMany(() => Materiel, materiel => materiel.association)
    materiels: Materiel[]

    @OneToMany(() => CompteTransaction, transaction => transaction.association)
    transactions: CompteTransaction[]

    @OneToMany(() => TypeAdhesion, typeAdhesion => typeAdhesion.association)
    typeAdhesions: TypeAdhesion[]

    @OneToMany(() => Evenement, evenement => evenement.association)
    evenements: Evenement[]

    @OneToMany(() => Role, role => role.association)
    roles: Role[]

    @OneToMany(() => Local, local => local.association)
    locaux: Local[]

    @OneToMany(() => Vote, vote => vote.association)
    votes: Vote[]

    @ManyToOne(() => Theme, theme => theme.associations)
    theme: Theme

    @ManyToOne(() => GED, ged => ged.associations)
    ged: GED

    constructor(id: number, name: string, description: string, domainName: string, users: User[], materiels: Materiel[], 
        transactions: CompteTransaction[], typeAdhesions: TypeAdhesion[], evenements: Evenement[] , roles: Role[], locaux: Local[], votes: Vote[], theme: Theme, ged: GED ) {
        this.id = id,
        this.name = name,
        this.description = description,
        this.domainName = domainName,
        this.users = users,
        this.materiels = materiels,
        this.transactions = transactions,
        this.typeAdhesions = typeAdhesions,
        this.evenements = evenements,
        this.roles = roles,
        this.locaux = locaux,
        this.votes = votes,
        this.theme = theme,
        this.ged = ged
    }
}