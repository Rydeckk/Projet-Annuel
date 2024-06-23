import { DataSource } from "typeorm";
import { Evenement } from "../database/entities/evenement";
import { Association } from "../database/entities/association";

export interface UpdateEvenementParams {
    name?: string
    type?: string,
    isPublic?: boolean,
    beginDate?: Date,
    endDate?: Date
}

export interface ListEvenementFilter {
    page: number,
    limit: number,
    type?: string,
    isPublic?: boolean,
    beginDate?: Date,
    endDate?: Date,
    associationId?: number
}

export class EvenementUseCase {
    constructor(private readonly db: DataSource) { }

    async getEvenement(id: number, asso?: Association): Promise <Evenement | null> {
        const repoEvenement = this.db.getRepository(Evenement)
        const evenementFound = await repoEvenement.findOne({where: {id: id,association: asso}, relations: ["association","attendees"]})
        
        if(evenementFound === null) return null

        return evenementFound
    }

    async getListEvent(eventFilter: ListEvenementFilter): Promise <{ events: Evenement[]}> {
        const query = this.db.createQueryBuilder(Evenement, 'event')
        query.innerJoin("event.association","asso")
        query.skip((eventFilter.page - 1) * eventFilter.limit)
        query.take(eventFilter.limit)

        if(eventFilter.type !== undefined) {
            query.andWhere("event.type = :type", {type: eventFilter.type})
        }

        if(eventFilter.isPublic !== undefined) {
            query.andWhere("event.isPublic = :isPublic", {isPublic: eventFilter.isPublic})
        }

        if(eventFilter.beginDate !== undefined) {
            query.andWhere("event.beginDate >= :beginDate", {beginDate: eventFilter.beginDate})
        }

        if(eventFilter.endDate !== undefined) {
            query.andWhere("event.endDate <= :endDate", {endDate: eventFilter.endDate})
        }

        if(eventFilter.associationId !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: eventFilter.associationId})
        }

        const events = await query.getMany()
        return {
            events
        }
    }

    async updateEvenement(id: number, updateEvent: UpdateEvenementParams, asso?: Association): Promise <Evenement | null> {
        const repoEvent = this.db.getRepository(Evenement)
        const eventFound = await repoEvent.findOne({where: {id: id, association: asso}})
        if(eventFound === null) return null

        if(updateEvent.name!== undefined) {
            eventFound.name = updateEvent.name
        }

        if(updateEvent.type !== undefined) {
            eventFound.type = updateEvent.type
        }

        if(updateEvent.isPublic !== undefined) {
            eventFound.isPublic = updateEvent.isPublic
        }

        if(updateEvent.beginDate !== undefined) {
            eventFound.beginDate = updateEvent.beginDate
        }

        if(updateEvent.endDate !== undefined) {
            eventFound.endDate = updateEvent.endDate
        }

        const updatedEvent = await repoEvent.save(eventFound)
        return updatedEvent
    }

    async deleteEvenement(id: number, asso?: Association):Promise <Evenement | null> {
        const repoEvent = this.db.getRepository(Evenement)
        const eventFound = await repoEvent.findOne({where: {id: id, association: asso}})
        if(eventFound === null) return null

        repoEvent.delete({id: id})
        return eventFound
    }
}