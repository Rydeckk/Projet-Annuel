import { DataSource } from "typeorm";
import { Vote } from "../database/entities/vote";
import { Association } from "../database/entities/association";
import { Assemblee } from "../database/entities/assemblee";

export interface UpdateVoteParams {
    name?: string,
    beginDate?: Date,
    endDate?: Date,
    voteIdParent?: number,
    assembleeId?: number
}

export interface ListVoteFilter {
    page: number,
    limit: number,
    beginDate?: Date,
    endDate?: Date,
    voteIdParent?: number,
    assembleeId?: number,
    associationId?: number
}

export class VoteUseCase {
    constructor(private readonly db: DataSource) { }

    async getVote(id: number, asso?: Association): Promise <Vote | null> {
        const repoVote = this.db.getRepository(Vote)
        const voteFound = await repoVote.findOne({where: {id: id,association: asso}, relations: ["association","parentVote","assemblee", "childVote"]})
        
        if(voteFound === null) return null

        return voteFound
    }

    async getListVote(voteFilter: ListVoteFilter): Promise <{ Votes: Vote[]}> {
        const query = this.db.createQueryBuilder(Vote, 'vote')
        query.innerJoinAndSelect("vote.association","asso")
        query.leftJoinAndSelect("vote.parentVote","pVote")
        query.leftJoinAndSelect("vote.assemblee","assemblee")
        query.leftJoinAndSelect("vote.reponses", "res")
        query.leftJoinAndSelect("vote.childVote", "child")
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

        if(voteFilter.assembleeId !== undefined) {
            query.andWhere("assemblee.id = :assembleeId", {assembleeId: voteFilter.assembleeId})
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
        const voteFound = await repoVote.findOne({where: {id: id, association: asso}, relations: ["parentVote","assemblee","childVote"]})
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

        if(updateVote.voteIdParent !== undefined) {
            const assembleeFound = await this.db.getRepository(Assemblee).findOneBy({id: updateVote.assembleeId, association: asso})
            if(assembleeFound) {
                voteFound.assemblee = assembleeFound
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