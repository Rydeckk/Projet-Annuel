import { DataSource } from "typeorm";
import { Assemblee } from "../database/entities/assemblee";
import { Association } from "../database/entities/association";

export interface UpdateAssembleeParams {
    location?: string
    description?: string
    beginDate?: Date
    endDate?: Date
}

export interface ListAssembleeFilter {
    page: number,
    limit: number,
    location?: string,
    beginDate?: Date,
    endDate?: Date,
    associationId?: number
}

export class AssembleeUseCase {
    constructor(private readonly db: DataSource) { }

    async getAssemblee(id: number, asso?: Association): Promise <Assemblee | null> {
        const repoAssemblee = this.db.getRepository(Assemblee)
        const assembleeFound = await repoAssemblee.findOne({where: {id: id,association: asso}, relations: ["association"]})
        
        if(assembleeFound === null) return null

        return assembleeFound
    }

    async getListAssemblee(assembleeFilter: ListAssembleeFilter): Promise <{ assemblees: Assemblee[]}> {
        const query = this.db.createQueryBuilder(Assemblee, 'assemblee')
        query.innerJoin("assemblee.association","asso")
        query.skip((assembleeFilter.page - 1) * assembleeFilter.limit)
        query.take(assembleeFilter.limit)

        if(assembleeFilter.location !== undefined) {
            query.andWhere("assemblee.location = :location", {location: assembleeFilter.location})
        }

        if(assembleeFilter.beginDate !== undefined) {
            query.andWhere("assemblee.beginDate >= :beginDate", {beginDate: assembleeFilter.beginDate})
        }

        if(assembleeFilter.endDate !== undefined) {
            query.andWhere("assemblee.endDate <= :endDate", {endDate: assembleeFilter.endDate})
        }

        if(assembleeFilter.associationId !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: assembleeFilter.associationId})
        }

        const assemblees = await query.getMany()
        return {
            assemblees
        }
    }

    async updateAssemblee(id: number, updateAssemblee: UpdateAssembleeParams, asso?: Association): Promise <Assemblee | null> {
        const repoAssemblee = this.db.getRepository(Assemblee)
        const assembleeFound = await repoAssemblee.findOne({where: {id: id, association: asso}})
        if(assembleeFound === null) return null

        if(updateAssemblee.description!== undefined) {
            assembleeFound.description = updateAssemblee.description
        }

        if(updateAssemblee.location !== undefined) {
            assembleeFound.location = updateAssemblee.location
        }

        if(updateAssemblee.beginDate !== undefined) {
            assembleeFound.beginDate = updateAssemblee.beginDate
        }

        if(updateAssemblee.endDate !== undefined) {
            assembleeFound.endDate = updateAssemblee.endDate
        }

        const updatedAssemblee = await repoAssemblee.save(assembleeFound)
        return updatedAssemblee
    }

    async deleteAssemblee(id: number, asso?: Association):Promise <Assemblee | null> {
        const repoAssemblee = this.db.getRepository(Assemblee)
        const assembleeFound = await repoAssemblee.findOne({where: {id: id, association: asso}})
        if(assembleeFound === null) return null

        repoAssemblee.delete({id: id})
        return assembleeFound
    }
}