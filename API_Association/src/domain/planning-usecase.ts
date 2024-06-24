import { DataSource } from "typeorm";
import { Planning } from "../database/entities/planning";
import { Association } from "../database/entities/association";
import { User } from "../database/entities/user";

export interface UpdatePlanningParams {
    title?: string,
    date?: Date,
    start_time?: string,
    end_time?: string
    listUser?: Array<number>
}

export interface ListPlanningFilter {
    page: number,
    limit: number,
    date?: Date,
    start_time?: string,
    end_time?: string
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
        query.innerJoinAndSelect("planning.users","users")
        query.skip((planningFilter.page - 1) * planningFilter.limit)
        query.take(planningFilter.limit)

        if(planningFilter.date !== undefined) {
            query.andWhere("planning.date = :date", {date: planningFilter.date.toISOString()})
        }

        if(planningFilter.start_time !== undefined) {
            query.andWhere("planning.start_time >= :start_time", {start_time: planningFilter.start_time})
        }

        if(planningFilter.end_time !== undefined) {
            query.andWhere("planning.end_time <= :end_time", {end_time: planningFilter.end_time})
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

        if(updatePlanning.date !== undefined) {
            planningFound.date = updatePlanning.date
        }

        if(updatePlanning.start_time !== undefined) {
            planningFound.start_time = updatePlanning.start_time
        }

        if(updatePlanning.end_time !== undefined) {
            planningFound.end_time = updatePlanning.end_time
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