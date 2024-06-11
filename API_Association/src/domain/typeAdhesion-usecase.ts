import { DataSource } from "typeorm";
import { Association } from "../database/entities/association";
import { TypeAdhesion } from "../database/entities/typeAdhesion";

export interface ListTypeAdhesionFilter {
    limit: number,
    page: number,
    type?: string,
    greaterThan?: number,
    lessThan?: number,
    associationId?: number
}

export interface UpdateTypeAdhesionParams {
    type?: string,
    montant?: number
}

export class TypeAdhesionUseCase {
    constructor(private readonly db: DataSource) { }

    async getTypeAdhesion(id: number, asso?: Association): Promise <TypeAdhesion | null> {
        const repoTypeAdhesion = this.db.getRepository(TypeAdhesion)
        const typeAdhesionFound = await repoTypeAdhesion.findOne({where: {id: id,association: asso}, relations: ["association"]})
        if(typeAdhesionFound === null) return null

        return typeAdhesionFound
    }

    async getListTypeAdhesion(typeAdhesionFilter: ListTypeAdhesionFilter): Promise <{ typeAdhesions: TypeAdhesion[]}> {
        const query = this.db.createQueryBuilder(TypeAdhesion, 'typeAdhesion')
        query.innerJoin("typeAdhesion.association","asso")
        query.skip((typeAdhesionFilter.page - 1) * typeAdhesionFilter.limit)
        query.take(typeAdhesionFilter.limit)

        if(typeAdhesionFilter.type !== undefined) {
            query.andWhere("typeAdhesion.type = :type", {type: typeAdhesionFilter.type})
        }

        if(typeAdhesionFilter.greaterThan !== undefined) {
            query.andWhere("typeAdhesion.montant >= :montant", {montant: typeAdhesionFilter.greaterThan})
        }

        if(typeAdhesionFilter.lessThan !== undefined) {
            query.andWhere("typeAdhesion.montant <= :montant", {montant: typeAdhesionFilter.lessThan})
        }

        if(typeAdhesionFilter.associationId !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: typeAdhesionFilter.associationId})
        }

        const typeAdhesions = await query.getMany()
        return {
            typeAdhesions
        }
    }

    async updateTypeAdhesion(id: number, typeAdhesionParams: UpdateTypeAdhesionParams, asso?: Association): Promise <TypeAdhesion | null> {
        const repoTypeAdhesion = this.db.getRepository(TypeAdhesion)
        const typeAdhesionFound = await repoTypeAdhesion.findOne({where: {id: id, association: asso}})
        if(typeAdhesionFound === null) return null

        if(typeAdhesionParams.type !== undefined) {
            typeAdhesionFound.type = typeAdhesionParams.type
        }

        if(typeAdhesionParams.montant !== undefined) {
            typeAdhesionFound.montant = typeAdhesionParams.montant
        }

        const updatedTypeAdhesion = await repoTypeAdhesion.save(typeAdhesionFound)
        return updatedTypeAdhesion
    }

    async deleteTypeAdhesion(id: number, asso?: Association):Promise <TypeAdhesion | null> {
        const repoTypeAdhesion = this.db.getRepository(TypeAdhesion)
        const typeAdhesionFound = await repoTypeAdhesion.findOne({where: {id: id, association: asso}})
        if(typeAdhesionFound === null) return null

        repoTypeAdhesion.delete({id: id})
        return typeAdhesionFound
    }
}