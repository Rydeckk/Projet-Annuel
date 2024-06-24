import { DataSource } from "typeorm";
import { Vote } from "../database/entities/vote";
import { Association } from "../database/entities/association";

export interface UpdateVoteParams {
    name?: string,
    beginDate?: Date,
    endDate?: Date,
    voteIdParent?: number
}

export interface ListVoteFilter {
    page: number,
    limit: number,
    beginDate?: Date,
    endDate?: Date,
    voteIdParent?: number,
    associationId?: number
}

export class VoteUseCase {
    constructor(private readonly db: DataSource) { }

    async getVote(id: number, asso?: Association): Promise <Vote | null> {
        const repoVote = this.db.getRepository(Vote)
        const voteFound = await repoVote.findOne({where: {id: id,association: asso}, relations: ["association","parentVote"]})
        
        if(voteFound === null) return null

        return voteFound
    }

    async getListVote(voteFilter: ListVoteFilter): Promise <{ Votes: Vote[]}> {
        const query = this.db.createQueryBuilder(Vote, 'vote')
        query.innerJoin("vote.association","asso")
        query.innerJoin("vote.parentVote","pVote")
        query.skip((voteFilter.page - 1) * voteFilter.limit)
        query.take(voteFilter.limit)

        if(voteFilter.beginDate !== undefined) {
            query.andWhere("Vote.beginDate >= :beginDate", {beginDate: voteFilter.beginDate})
        }

        if(voteFilter.endDate !== undefined) {
            query.andWhere("Vote.endDate <= :endDate", {endDate: voteFilter.endDate})
        }

        if(voteFilter.voteIdParent !== undefined) {
            query.andWhere("pVote.id = :voteIdParent", {voteIdParent: voteFilter.voteIdParent})
        }

        if(voteFilter.associationId !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: voteFilter.associationId})
        }

        const Votes = await query.getMany()
        return {
            Votes
        }
    }

    async updateVote(id: number, updateVote: UpdateVoteParams, asso?: Association): Promise <Vote | null> {
        const repoVote = this.db.getRepository(Vote)
        const voteFound = await repoVote.findOne({where: {id: id, association: asso}})
        if(voteFound === null) return null

        if(updateVote.name!== undefined) {
            voteFound.name = updateVote.name
        }

        if(updateVote.beginDate !== undefined) {
            voteFound.beginDate = updateVote.beginDate
        }

        if(updateVote.endDate !== undefined) {
            voteFound.endDate = updateVote.endDate
        }

        if(updateVote.voteIdParent !== undefined) {
            const parentVoteFound = await this.db.getRepository(Vote).findOneBy({id: updateVote.voteIdParent, association: asso})
            if(parentVoteFound) {
                voteFound.parentVote = parentVoteFound
            }
        }

        const updatedAsso = await repoVote.save(voteFound)
        return updatedAsso
    }

    async deleteVote(id: number, asso?: Association):Promise <Vote | null> {
        const repoVote = this.db.getRepository(Vote)
        const voteFound = await repoVote.findOne({where: {id: id, association: asso}})
        if(voteFound === null) return null

        repoVote.delete({id: id})
        return voteFound
    }
}