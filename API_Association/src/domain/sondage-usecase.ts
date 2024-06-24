import { DataSource } from "typeorm";
import { Sondage } from "../database/entities/sondage";
import { Association } from "../database/entities/association";

export interface UpdateSondageParams {
    name?: string,
    beginDate?: Date,
    endDate?: Date
}

export interface ListSondageFilter {
    page: number,
    limit: number,
    beginDate?: Date,
    endDate?: Date,
    associationId?: number
}

export class SondageUseCase {
    constructor(private readonly db: DataSource) { }

    async getSondage(id: number, asso?: Association): Promise <Sondage | null> {
        const repoSondage = this.db.getRepository(Sondage)
        const sondageFound = await repoSondage.findOne({where: {id: id,association: asso}, relations: ["association"]})
        
        if(sondageFound === null) return null

        return sondageFound
    }

    async getListSondage(sondageFilter: ListSondageFilter): Promise <{ Sondages: Sondage[]}> {
        const query = this.db.createQueryBuilder(Sondage, 'sondage')
        query.innerJoin("sondage.association","asso")
        query.skip((sondageFilter.page - 1) * sondageFilter.limit)
        query.take(sondageFilter.limit)

        if(sondageFilter.beginDate !== undefined) {
            query.andWhere("Sondage.beginDate >= :beginDate", {beginDate: sondageFilter.beginDate})
        }

        if(sondageFilter.endDate !== undefined) {
            query.andWhere("Sondage.endDate <= :endDate", {endDate: sondageFilter.endDate})
        }

        if(sondageFilter.associationId !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: sondageFilter.associationId})
        }

        const Sondages = await query.getMany()
        return {
            Sondages
        }
    }

    async updateSondage(id: number, updateSondage: UpdateSondageParams, asso?: Association): Promise <Sondage | null> {
        const repoSondage = this.db.getRepository(Sondage)
        const sondageFound = await repoSondage.findOne({where: {id: id, association: asso}})
        if(sondageFound === null) return null

        if(updateSondage.name!== undefined) {
            sondageFound.name = updateSondage.name
        }

        if(updateSondage.beginDate !== undefined) {
            sondageFound.beginDate = updateSondage.beginDate
        }

        if(updateSondage.endDate !== undefined) {
            sondageFound.endDate = updateSondage.endDate
        }

        const updatedAsso = await repoSondage.save(sondageFound)
        return updatedAsso
    }

    async deleteSondage(id: number, asso?: Association):Promise <Sondage | null> {
        const repoSondage = this.db.getRepository(Sondage)
        const sondageFound = await repoSondage.findOne({where: {id: id, association: asso}})
        if(sondageFound === null) return null

        repoSondage.delete({id: id})
        return sondageFound
    }
}