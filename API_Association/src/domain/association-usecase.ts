import { DataSource } from "typeorm";
import { Association } from "../database/entities/association";
import { Theme } from "../database/entities/theme";
import { GED } from "../database/entities/ged";

export interface UpdateAssociationParams {
    name?: string,
    domainName?: string,
    description?: string,
    themeId?: number,
    gedId?: number
}

export interface GetAssociationsFilter {
    page: number,
    limit: number
    domainName?: string
}

export class AssociationUseCase {
    constructor(private readonly db: DataSource) { }

    async getAssociation(id: number): Promise <Association | null> {
        const query = this.db.createQueryBuilder(Association, "asso")
        query.innerJoinAndSelect("asso.theme","theme")
        query.innerJoinAndSelect("asso.ged","ged")
        query.where("asso.id = :id", {id: id})

        const AssociationFound = await query.getOne()
        if(AssociationFound === null) return null

        return AssociationFound
    }

    async updateAssociation(id: number, updateAsso: UpdateAssociationParams): Promise <Association | null> {
        const repoAsso = this.db.getRepository(Association)
        const assoFound = await repoAsso.findOneBy({id: id})
        if(assoFound === null) return null

        if(updateAsso.name) {
            assoFound.name = updateAsso.name
        }

        if(updateAsso.description) {
            assoFound.description = updateAsso.description
        }

        if(updateAsso.domainName) {
            assoFound.domainName = updateAsso.domainName
        }

        if(updateAsso.themeId) {
            const themeFound = await this.db.getRepository(Theme).findOneBy({id: updateAsso.themeId})
            if(themeFound) {
                assoFound.theme = themeFound
            }
        }

        if(updateAsso.gedId) {
            const gedFound = await this.db.getRepository(GED).findOneBy({id: updateAsso.gedId})
            if(gedFound) {
                assoFound.ged = gedFound
            }
        }

        const updatedAsso = await repoAsso.save(assoFound)
        return updatedAsso
    }

    async getListAssociation(assoFilter: GetAssociationsFilter): Promise<{ associations: Association[]}> {
        const query = this.db.createQueryBuilder(Association, 'asso')
        query.skip((assoFilter.page - 1) * assoFilter.limit)
        query.take(assoFilter.limit)

        if(assoFilter.domainName !== undefined) {
            query.andWhere("asso.domainName >= :domainName", {domainName: assoFilter.domainName})
        }

        const associations = await query.getMany()
        return {
            associations
        }
    }
}