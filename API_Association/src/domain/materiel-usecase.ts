import { DataSource } from "typeorm";
import { Materiel } from "../database/entities/materiel";
import { Association } from "../database/entities/association";
import { User } from "../database/entities/user";

export interface ListMaterielFilter {
    limit: number,
    page: number,
    name?: string,
    type?: string,
    userId?: number,
    isUse?: boolean,
    associationId?: number
}

export interface UpdateMaterielParams {
    name?: string,
    type?: string,
    userId?: number,
}

export class MaterielUseCase {
    constructor(private readonly db: DataSource) { }

    async getMateriel(id: number, asso?: Association): Promise <Materiel | null> {
        const repoMateriel = this.db.getRepository(Materiel)
        const MaterielFound = await repoMateriel.findOne({where: {id: id,association: asso}, relations: ["association","user"]})
        if(MaterielFound === null) return null

        return MaterielFound
    }

    async getListMateriel(materielsFilter: ListMaterielFilter): Promise <{ materiels: Materiel[]}> {
        const query = this.db.createQueryBuilder(Materiel, 'materiel')
        query.innerJoin("materiel.association","asso")
        query.skip((materielsFilter.page - 1) * materielsFilter.limit)
        query.take(materielsFilter.limit)

        if(materielsFilter.name !== undefined) {
            query.andWhere("materiel.name = :name", {name: materielsFilter.name})
        }

        if(materielsFilter.type !== undefined) {
            query.andWhere("materiel.type = :type", {type: materielsFilter.type})
        }

        if(materielsFilter.userId !== undefined) {
            query.andWhere("materiel.zip = :userId", {userId: materielsFilter.userId})
        }

        if(materielsFilter.isUse !== undefined) {
            query.innerJoin("materiel.userId","user")
        }
        else {
            query.leftJoin("materiel.userId","user")
        }

        if(materielsFilter.associationId !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: materielsFilter.associationId})
        }

        const materiels = await query.getMany()
        return {
            materiels
        }
    }

    async updateMateriel(id: number, materielParams: UpdateMaterielParams, asso?: Association): Promise <Materiel | null> {
        const repoMateriel = this.db.getRepository(Materiel)
        const materielFound = await repoMateriel.findOne({where: {id: id, association: asso}})
        if(materielFound === null) return null

        if(materielParams.name !== undefined) {
            materielFound.name = materielParams.name
        }

        if(materielParams.type !== undefined) {
            materielFound.type = materielParams.type
        }

        if(materielParams.userId !== undefined) {
            const userFound = await this.db.getRepository(User).findOneBy({id: materielParams.userId})
            if(userFound) {
                materielFound.user = userFound
            }
            
        }

        const updatedMateriel = await repoMateriel.save(materielFound)
        return updatedMateriel
    }

    async deleteMateriel(id: number, asso?: Association):Promise <Materiel | null> {
        const repoMateriel = this.db.getRepository(Materiel)
        const materielFound = await repoMateriel.findOne({where: {id: id, association: asso}})
        if(materielFound === null) return null

        repoMateriel.delete({id: id})
        return materielFound
    }
}