import { DataSource } from "typeorm";
import { Planning } from "../database/entities/planning";
import { Association } from "../database/entities/association";
import { User } from "../database/entities/user";

export interface UpdatePlanningParams {
    title?: string,
    beginDate?: Date,
    endDate?: Date,
    listUser?: Array<number>
}

export interface ListPlanningFilter {
    page: number,
    limit: number,
    beginDate?: Date,
    endDate?: Date,
    listUser?: Array<number>,
    associationId?: number
}

export class PlanningUseCase {
    constructor(private readonly db: DataSource) { }

    async getPlanning(id: number, asso?: Association): Promise <Planning | null> {
        const repoPlanning = this.db.getRepository(Planning)
        const planningFound = await repoPlanning.findOne({where: {id: id,association: asso}, relations: ["association","users"]})
        
        if(planningFound === null) return null

        return planningFound
    }

    async getListPlanning(planningFilter: ListPlanningFilter): Promise <{ plannings: Planning[]}> {
        const query = this.db.createQueryBuilder(Planning, 'planning')
        query.innerJoin("planning.association","asso")
        query.innerJoin("planning.users","users")
        query.skip((planningFilter.page - 1) * planningFilter.limit)
        query.take(planningFilter.limit)

        if(planningFilter.beginDate !== undefined) {
            query.andWhere("planning.beginDate >= :beginDate", {beginDate: planningFilter.beginDate})
        }

        if(planningFilter.endDate !== undefined) {
            query.andWhere("planning.endDate <= :endDate", {endDate: planningFilter.endDate})
        }

        if(planningFilter.listUser !== undefined) {
            query.andWhere("users.id IN (:...listUser)", {listUser: planningFilter.listUser})
        }

        if(planningFilter.associationId !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: planningFilter.associationId})
        }

        const plannings = await query.getMany()
        return {
            plannings
        }
    }

    async updatePlanning(id: number, updatePlanning: UpdatePlanningParams, asso?: Association): Promise <Planning | null> {
        const repoPlanning = this.db.getRepository(Planning)
        const planningFound = await repoPlanning.findOne({where: {id: id, association: asso}})
        if(planningFound === null) return null

        if(updatePlanning.title !== undefined) {
            planningFound.title = updatePlanning.title
        }

        if(updatePlanning.beginDate !== undefined) {
            planningFound.beginDate = updatePlanning.beginDate
        }

        if(updatePlanning.endDate !== undefined) {
            planningFound.endDate = updatePlanning.endDate
        }

        if(updatePlanning.listUser !== undefined) {
            planningFound.users = []
            updatePlanning.listUser.forEach(async userId => {
                const userFound = await this.db.getRepository(User).findOneBy({id: userId})
                if(userFound !== null) {
                    planningFound.users.push(userFound)
                }
            })
        }

        const updatedPlanning = await repoPlanning.save(planningFound)
        return updatedPlanning
    }

    async deletePlanning(id: number, asso?: Association):Promise <Planning | null> {
        const repoPlanning = this.db.getRepository(Planning)
        const planningFound = await repoPlanning.findOne({where: {id: id, association: asso}})
        if(planningFound === null) return null

        repoPlanning.delete({id: id})
        return planningFound
    }
}