import { DataSource } from "typeorm";
import { Adhesion } from "../database/entities/adhesion";
import { Association } from "../database/entities/association";
import { TypeAdhesion } from "../database/entities/typeAdhesion";

export interface ListAdhesionFilter {
    limit: number,
    page: number,
    isActive?: boolean,
    beginDate?: Date,
    endDate?: Date,
    associationId?: number
}

export interface UpdateAdhesionParams {
    isActive?: boolean,
    beginDate?: Date,
    endDate?: Date,
    typeAdhesionId?: number
}

export class AdhesionUseCase {
    constructor(private readonly db: DataSource) { }

    async getAdhesion(id: number, asso?: Association): Promise <Adhesion | null> {
        const query = this.db.createQueryBuilder(Adhesion, "adhesion")
        query.innerJoinAndSelect("adhesion.typeAdhesion","typeAdhesion")
        query.innerJoin("typeAdhesion.association","asso")
        query.andWhere("asso.id = :assoId", {assoId: asso?.id})
        query.andWhere("adhesion.id = :id", {id: id})
        
        const adhesionFound = await query.getOne()
        
        if(adhesionFound === null) return null

        return adhesionFound
    }

    async getListAdhesion(adhesionFilter: ListAdhesionFilter): Promise <{ Adhesions: Adhesion[]}> {
        const query = this.db.createQueryBuilder(Adhesion, 'adhesion')
        query.innerJoinAndSelect("adhesion.typeAdhesion","typeAdhesion")
        query.innerJoin("typeAdhesion.association","asso")
        query.andWhere("asso.id = :assoId", {assoId: adhesionFilter.associationId})
        query.skip((adhesionFilter.page - 1) * adhesionFilter.limit)
        query.take(adhesionFilter.limit)

        if(adhesionFilter.isActive !== undefined) {
            query.andWhere("adhesion.isActive = :isActive", {isActive: adhesionFilter.isActive})
        }

        if(adhesionFilter.beginDate) {
            query.andWhere("adhesion.beginDate >= :beginDate", {beginDate: adhesionFilter.beginDate})
        }

        if(adhesionFilter.endDate) {
            query.andWhere("adhesion.endDate <= :endDate", {endDate: adhesionFilter.endDate})
        }

        const Adhesions = await query.getMany()
        return {
            Adhesions
        }
    }

    async updateAdhesion(id: number, updateAdhesion: UpdateAdhesionParams, asso?: Association): Promise <Adhesion | null> {
        const query = this.db.createQueryBuilder(Adhesion, "adhesion")
        query.innerJoinAndSelect("adhesion.typeAdhesion","typeAdhesion")
        query.leftJoinAndSelect("adhesion.applicant","user")
        query.andWhere("adhesion.id = :id", {id: id})
        query.andWhere("asso.id = :assoId", {assoId: asso?.id})
        
        const adhesionFound = await query.getOne()

        if(adhesionFound === null) return null

        if(updateAdhesion.isActive !== undefined) {
            adhesionFound.isActive = updateAdhesion.isActive
        }

        if(updateAdhesion.beginDate) {
            adhesionFound.beginDate = updateAdhesion.beginDate        
        }

        if(updateAdhesion.endDate) {
            adhesionFound.endDate = updateAdhesion.endDate
        }

        if(updateAdhesion.typeAdhesionId) {
            const typeAdhesionFound = await this.db.getRepository(TypeAdhesion).findOne({where: {id: updateAdhesion.typeAdhesionId, association: asso}})
            if(typeAdhesionFound) {
                adhesionFound.typeAdhesion = typeAdhesionFound
            }
        }

        const repoAdhesion = this.db.getRepository(Adhesion)
        const updatedAsso = await repoAdhesion.save(adhesionFound)
        return updatedAsso
    }

    async deleteAdhesion(id: number, asso?: Association):Promise <Adhesion | null> {
        const query = this.db.createQueryBuilder(Adhesion, "adhesion")
        query.innerJoinAndSelect("adhesion.typeAdhesion","typeAdhesion")
        query.leftJoinAndSelect("adhesion.applicant","user")
        query.where("typeAdhesion.association = :asso", {asso: asso})
        query.andWhere("adhesion.id = :id", {id: id})
        
        const adhesionFound = await query.getOne()

        if(adhesionFound === null) return null

        const repoAdhesion = this.db.getRepository(Adhesion)
        repoAdhesion.delete({id: id})
        return adhesionFound
    }
}