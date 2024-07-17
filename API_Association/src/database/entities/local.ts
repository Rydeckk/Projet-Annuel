import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Association } from "./association";

@Entity({name: "Local"})
export class Local {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    phone: string

    @Column()
    email: string

    @Column()
    country: string

    @Column()
    city: string

    @Column()
    zip: string

    @Column()
    address: string

    @ManyToOne(() => Association, association => association.locaux)
    association: Association

    constructor(id: number, name: string, phone: string, email: string, country: string, city: string,zip: string, address: string, association: Association) {
        this.id = id,
        this.name = name,
        this.phone = phone,
        this.email = email,
        this.country = country,
        this.city = city,
        this.zip = zip,
        this.address = address,
        this.association = association
    }
}