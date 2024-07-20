import { DataSource } from "typeorm";
import { Reponse } from "../database/entities/reponse";
import { Association } from "../database/entities/association";
import { Vote } from "../database/entities/vote";
import { User } from "../database/entities/user";
import { Sondage } from "../database/entities/sondage";
import { UserUseCase } from "./user-usecase";

export interface UpdateReponseParams {
    name?: string,
    applicantId?: Array<number>
}

export interface ListReponseFilter {
    page: number,
    limit: number,
    sondageId?: number,
    voteId?: number,
    assoId?: number
}

export class ReponseUseCase {
    constructor(private readonly db: DataSource) { }

    async getReponse(id: number, sondage?: Sondage, vote?: Vote): Promise <Reponse | null> {
        const query = this.db.createQueryBuilder(Reponse, "rep")
            .leftJoinAndSelect("rep.voters","voters")
            .leftJoinAndSelect("rep.applicants","applicants")
            .leftJoinAndSelect("rep.sondage","sondage")
            .leftJoinAndSelect("rep.vote","vote")

        query.where("sondage.id = :sondageId", {sondageId: sondage?.id})
            .orWhere("vote.id = :voteId", {voteId: vote?.id})
            .andWhere("rep.id = :id", {id: id})
        
        const reponseFound = await query.getOne()
        
        if(reponseFound === null) return null

        return reponseFound
    }

    async getListReponse(reponseFilter: ListReponseFilter): Promise <{ Reponses: Reponse[]}> {
        console.log(reponseFilter)
        const query = this.db.createQueryBuilder(Reponse, 'rep')
            .leftJoinAndSelect("rep.voters","voters")
            .leftJoinAndSelect("rep.applicants","applicants")
        
        query.skip((reponseFilter.page - 1) * reponseFilter.limit)
        query.take(reponseFilter.limit)

        if(reponseFilter.sondageId !== undefined) {
            query.innerJoinAndSelect("rep.sondage","sondage")
            query.innerJoin("sondage.association","asso")
            query.andWhere("sondage.id = :sondageId", {sondageId: reponseFilter.sondageId})
            query.andWhere("asso.id = :assoId", {assoId: reponseFilter.assoId})
        }

        if(reponseFilter.voteId !== undefined) {
            query.innerJoinAndSelect("rep.vote","vote")
            query.innerJoin("vote.association","asso")
            query.andWhere("vote.id = :voteId", {voteId: reponseFilter.voteId})
            query.andWhere("asso.id = :assoId", {assoId: reponseFilter.assoId})
        }

        const Reponses = await query.getMany()
        return {
            Reponses
        }
    }

    async updateReponse(id: number, updateReponse: UpdateReponseParams, sondage?: Sondage, vote?: Vote, asso?: Association): Promise <Reponse | null> {
        const query = this.db.createQueryBuilder(Reponse, "rep")
            .leftJoinAndSelect("rep.voters","voters")
            .leftJoinAndSelect("rep.applicants","applicants")
            .leftJoinAndSelect("rep.sondage","sondage")
            .leftJoinAndSelect("rep.vote","vote")

        query.where("rep.id = :id", {id: id})
            .andWhere("sondage.id = :sondageId", {sondageId: sondage?.id})
            .orWhere("vote.id = :voteId", {voteId: vote?.id})
        
        const reponseFound = await query.getOne()

        if(reponseFound === null) return null

        if(updateReponse.name !== undefined) {
            reponseFound.name = updateReponse.name
        }

        if(updateReponse.applicantId !== undefined) {
            const applicants: User[] = []
                const userUseCase = new UserUseCase(this.db)
                updateReponse.applicantId.forEach(async (applicant) => {
                    const userFound = await userUseCase.getUser(applicant,asso,false)
                    if(userFound) {
                        applicants.push(userFound)
                    }
                })
        }

        const repoReponse = this.db.getRepository(Reponse)
        const updatedAsso = await repoReponse.save(reponseFound)
        return updatedAsso
    }

    async deleteReponse(id: number, sondage?: Sondage, vote?: Vote):Promise <Reponse | null> {
        const query = this.db.createQueryBuilder(Reponse, "rep")
        query.leftJoin("rep.sondage","sondage")
        query.leftJoin("rep.vote","vote")

        query.where("sondage.id = :sondageId", {sondageId: sondage?.id})
            .orWhere("vote.id = :voteId", {voteId: vote?.id})
            .andWhere("rep.id = :id", {id: id})
        
        const reponseFound = await query.getOne()

        if(reponseFound === null) return null

        const repoReponse = this.db.getRepository(Reponse)
        repoReponse.delete({id: id})
        return reponseFound
    }
}