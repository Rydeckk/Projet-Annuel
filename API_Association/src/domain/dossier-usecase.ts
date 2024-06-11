import { DataSource } from "typeorm";
import { GED } from "../database/entities/ged";
import { Dossier } from "../database/entities/dossier";

export interface ListDossiersFilter {
    limit: number,
    page: number,
    createdAfter?: Date,
    createdBefore?: Date,
    gedId?: number
}

export interface UpdateDossierParams {
    name?: string,
    path?: string
}

export class DossierUseCase {
    constructor(private readonly db: DataSource) { }

    async getDossier(id: number, ged?: GED): Promise <Dossier | null> {
        const repoDossier = this.db.getRepository(Dossier)
        const dossierFound = await repoDossier.findOne({where: {id: id,ged: ged}, relations: ["ged"]})
        if(dossierFound === null) return null

        return dossierFound
    }

    async getListDossier(dossiersFilter: ListDossiersFilter): Promise <{ dossiers: Dossier[]}> {
        const query = this.db.createQueryBuilder(Dossier, 'dossier')
        query.innerJoin("dossier.ged","ged")
        query.skip((dossiersFilter.page - 1) * dossiersFilter.limit)
        query.take(dossiersFilter.limit)

        if(dossiersFilter.createdAfter !== undefined) {
            query.andWhere("dossier.addedDate >= :createdAfter", {createdAfter: dossiersFilter.createdAfter})
        }

        if(dossiersFilter.createdBefore !== undefined) {
            query.andWhere("dossier.addedDate <= :createdBefore", {createdBefore: dossiersFilter.createdBefore})
        }

        if(dossiersFilter.gedId !== undefined) {
            query.andWhere("ged.id = :gedId", {gedId: dossiersFilter.gedId})
        }

        const dossiers = await query.getMany()
        return {
            dossiers
        }
    }

    async updateDossier(id: number, dossierParams: UpdateDossierParams, ged?: GED): Promise <Dossier | null> {
        const repoDossier = this.db.getRepository(Dossier)
        const dossierFound = await repoDossier.findOne({where: {id: id, ged: ged}})
        if(dossierFound === null) return null

        if(dossierParams.name !== undefined) {
            dossierFound.name = dossierParams.name
        }

        if(dossierParams.path !== undefined) {
            dossierFound.path = dossierParams.path
        }

        const updatedDossier = await repoDossier.save(dossierFound)
        return updatedDossier
    }

    async deleteDossier(id: number, ged?: GED):Promise <Dossier | null> {
        const repoDossier = this.db.getRepository(Dossier)
        const dossierFound = await repoDossier.findOne({where: {id: id, ged: ged}})
        if(dossierFound === null) return null

        repoDossier.delete({id: id})
        return dossierFound
    }
}