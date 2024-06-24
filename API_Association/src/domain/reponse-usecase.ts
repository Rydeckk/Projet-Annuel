import { DataSource } from "typeorm";
import { Reponse } from "../database/entities/reponse";
import { Association } from "../database/entities/association";
import { Vote } from "../database/entities/vote";
import { User } from "../database/entities/user";
import { Sondage } from "../database/entities/sondage";

export interface UpdateReponseSondageParams {
    name?: string,
    sondageId?: number
}

export interface ListReponseSondageFilter {
    page: number,
    limit: number,
    sondageId?: number,
    associationId?: number
}

export class ReponseUseCase {
    constructor(private readonly db: DataSource) { }

    async getReponseSondage(id: number, sondage: Sondage, asso?: Association): Promise <Reponse | null> {
        const query = this.db.createQueryBuilder(Reponse, "rep")
        query.innerJoin("rep.sondage","sondage")
        query.leftJoinAndSelect("rep.voters","voters")
        query.innerJoin("sondage.association","asso")
        query.andWhere("asso.id = :assoId", {assoId: asso?.id})
        query.andWhere("sondage.id = :sondageId", {sondageId: sondage.id})
        query.andWhere("rep.id = :id", {id: id})
        
        const reponseFound = await query.getOne()
        
        if(reponseFound === null) return null

        return reponseFound
    }

    async getListReponseSondage(reponseFilter: ListReponseSondageFilter): Promise <{ Reponses: Reponse[]}> {
        const query = this.db.createQueryBuilder(Reponse, 'rep')
        query.innerJoin("rep.sondage","sondage")
        query.innerJoin("sondage.association","asso")
        query.andWhere("asso.id = :assoId", {assoId: reponseFilter.associationId})
        query.andWhere("sondage.id = :sondageId", {sondageId: reponseFilter.sondageId})
        query.skip((reponseFilter.page - 1) * reponseFilter.limit)
        query.take(reponseFilter.limit)

        const Reponses = await query.getMany()
        return {
            Reponses
        }
    }

    async updateReponseSondage(id: number, updateReponse: UpdateReponseSondageParams, asso?: Association): Promise <Reponse | null> {
        const query = this.db.createQueryBuilder(Reponse, "rep")
        query.innerJoin("rep.sondage","sondage")
        query.innerJoin("sondage.association","asso")
        query.andWhere("rep.id = :id", {id: id})
        query.andWhere("asso.id = :assoId", {assoId: asso?.id})
        query.andWhere("sondage.id = :sondageId", {sondageId: updateReponse.sondageId})
        
        const reponseFound = await query.getOne()

        if(reponseFound === null) return null

        if(updateReponse.name !== undefined) {
            reponseFound.name = updateReponse.name
        }

        const repoReponse = this.db.getRepository(Reponse)
        const updatedAsso = await repoReponse.save(reponseFound)
        return updatedAsso
    }

    async deleteReponseSondage(id: number, sondageId: number, asso?: Association):Promise <Reponse | null> {
        const query = this.db.createQueryBuilder(Reponse, "rep")
        query.innerJoin("rep.sondage","sondage")
        query.innerJoin("sondage.association","asso")
        query.where("sondage.id = :sondageId", {sondageId: sondageId})
        query.andWhere("asso.id = :assoId", {assoId: asso?.id})
        query.andWhere("rep.id = :id", {id: id})
        
        const reponseFound = await query.getOne()

        if(reponseFound === null) return null

        const repoReponse = this.db.getRepository(Reponse)
        repoReponse.delete({id: id})
        return reponseFound
    }
}