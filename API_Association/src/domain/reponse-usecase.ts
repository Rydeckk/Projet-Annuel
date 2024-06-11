import { DataSource } from "typeorm";
import { Reponse } from "../database/entities/reponse";
import { Association } from "../database/entities/association";
import { Vote } from "../database/entities/vote";
import { User } from "../database/entities/user";

export interface UpdateReponseParams {
    name?: string,
    voteId?: number,
    applicantId?: number
}

export interface ListReponseFilter {
    page: number,
    limit: number,
    voteId?: number,
    applicantId?: number
}

export class ReponseUseCase {
    constructor(private readonly db: DataSource) { }

    async getReponse(id: number, vote: Vote): Promise <Reponse | null> {
        const query = this.db.createQueryBuilder(Reponse, "rep")
        query.innerJoinAndSelect("rep.vote","vote")
        query.leftJoinAndSelect("rep.applicant","user")
        query.leftJoinAndSelect("rep.voters","voters")
        query.innerJoin("vote.association","asso")
        query.andWhere("vote.id = :voteId", {voteId: vote.id})
        query.andWhere("rep.id = :id", {id: id})
        
        const reponseFound = await query.getOne()
        
        if(reponseFound === null) return null

        return reponseFound
    }

    async getListReponse(reponseFilter: ListReponseFilter): Promise <{ Reponses: Reponse[]}> {
        const query = this.db.createQueryBuilder(Reponse, 'rep')
        query.innerJoinAndSelect("rep.vote","vote")
        query.leftJoinAndSelect("rep.applicant","user")
        query.innerJoin("vote.association","asso")
        query.andWhere("vote.id = :voteId", {voteId: reponseFilter.voteId})
        query.skip((reponseFilter.page - 1) * reponseFilter.limit)
        query.take(reponseFilter.limit)

        if(reponseFilter.applicantId !== undefined) {
            query.andWhere("user.id = :userId", {userId: reponseFilter.applicantId})
        }

        const Reponses = await query.getMany()
        return {
            Reponses
        }
    }

    async updateReponse(id: number, updateReponse: UpdateReponseParams, asso?: Association): Promise <Reponse | null> {
        const query = this.db.createQueryBuilder(Reponse, "rep")
        query.innerJoinAndSelect("rep.vote","vote")
        query.leftJoinAndSelect("rep.applicant","user")
        query.innerJoin("vote.association","asso")
        query.andWhere("rep.id = :id", {id: id})
        query.andWhere("vote.id = :voteId", {voteId: updateReponse.voteId})
        
        const reponseFound = await query.getOne()

        if(reponseFound === null) return null

        if(updateReponse.name !== undefined) {
            reponseFound.name = updateReponse.name
        }

        if(updateReponse.applicantId !== undefined) {
            const userFound = await this.db.getRepository(User).findOne({where: {id: updateReponse.applicantId, association: asso}})
            if(userFound) {
                reponseFound.applicant = userFound
            }
        }

        const repoReponse = this.db.getRepository(Reponse)
        const updatedAsso = await repoReponse.save(reponseFound)
        return updatedAsso
    }

    async deleteReponse(id: number, voteId: number):Promise <Reponse | null> {
        const query = this.db.createQueryBuilder(Reponse, "rep")
        query.innerJoinAndSelect("rep.vote","vote")
        query.leftJoinAndSelect("rep.applicant","user")
        query.innerJoin("vote.association","asso")
        query.where("vote.id = :voteId", {voteId: voteId})
        query.andWhere("rep.id = :id", {id: id})
        
        const reponseFound = await query.getOne()

        if(reponseFound === null) return null

        const repoReponse = this.db.getRepository(Reponse)
        repoReponse.delete({id: id})
        return reponseFound
    }
}