import { DataSource } from "typeorm";
import { Local } from "../database/entities/local";
import { Association } from "../database/entities/association";

export interface ListlocauxFilter {
    limit: number,
    page: number,
    country?: string,
    city?: string,
    zip?: string,
    address?: string,
    associationId?: number
}

export interface UpdateLocalParams {
    country?: string,
    city?: string,
    zip?: string,
    address?: string,
    associationId?: number
}

export class LocalUseCase {
    constructor(private readonly db: DataSource) { }

    async getLocal(id: number, asso?: Association): Promise <Local | null> {
        const repoLocal = this.db.getRepository(Local)
        const localFound = await repoLocal.findOne({where: {id: id,association: asso}, relations: ["association"]})
        if(localFound === null) return null

        return localFound
    }

    async getListLocal(locauxFilter: ListlocauxFilter): Promise <{ locaux: Local[]}> {
        const query = this.db.createQueryBuilder(Local, 'local')
        query.innerJoin("local.association","asso")
        query.skip((locauxFilter.page - 1) * locauxFilter.limit)
        query.take(locauxFilter.limit)

        if(locauxFilter.country !== undefined) {
            query.andWhere("local.country = :country", {country: locauxFilter.country})
        }

        if(locauxFilter.city !== undefined) {
            query.andWhere("local.city = :city", {city: locauxFilter.city})
        }

        if(locauxFilter.zip !== undefined) {
            query.andWhere("local.zip = :zip", {zip: locauxFilter.zip})
        }

        if(locauxFilter.address !== undefined) {
            query.andWhere("local.address = :address", {address: locauxFilter.address})
        }

        if(locauxFilter.associationId !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: locauxFilter.associationId})
        }

        const locaux = await query.getMany()
        return {
            locaux
        }
    }

    async updateLocal(id: number, localParams: UpdateLocalParams, asso?: Association): Promise <Local | null> {
        const repoLocal = this.db.getRepository(Local)
        const localFound = await repoLocal.findOne({where: {id: id, association: asso}})
        if(localFound === null) return null

        if(localParams.country !== undefined) {
            localFound.country = localParams.country
        }

        if(localParams.city !== undefined) {
            localFound.city = localParams.city
        }

        if(localParams.zip !== undefined) {
            localFound.zip = localParams.zip
        }

        if(localParams.address !== undefined) {
            localFound.address = localParams.address
        }

        const updatedLocal = await repoLocal.save(localFound)
        return updatedLocal
    }

    async deleteLocal(id: number, asso?: Association):Promise <Local | null> {
        const repoLocal = this.db.getRepository(Local)
        const localFound = await repoLocal.findOne({where: {id: id, association: asso}})
        if(localFound === null) return null

        repoLocal.delete({id: id})
        return localFound
    }
}