import { DataSource } from "typeorm";
import { GED } from "../database/entities/ged";
import { Fichier } from "../database/entities/fichier";
import multer from "multer";
import fs from "fs-extra"

export interface ListFichiersFilter {
    limit: number,
    page: number,
    createdAfter?: Date,
    createdBefore?: Date,
    gedId?: number,
    parentFolderId?: number
}

export interface UpdateFichierParams {
    name?: string,
    parentFolderId?: number
}

export class FichierUseCase {
    constructor(private readonly db: DataSource) { }

    async getFichier(id: number, ged?: GED, type?: string): Promise <Fichier | null> {
        const repoFichier = this.db.getRepository(Fichier)
        const fichierFound = await repoFichier.findOne({where: {id: id,ged: ged, type: type}, relations: ["ged"]})
        if(fichierFound === null) return null

        return fichierFound
    }

    async getListFichier(fichiersFilter: ListFichiersFilter): Promise <{ fichiers: Fichier[]}> {
        const query = this.db.createQueryBuilder(Fichier, 'fichier')
        query.innerJoin("fichier.ged","ged")
        query.skip((fichiersFilter.page - 1) * fichiersFilter.limit)
        query.take(fichiersFilter.limit)

        if(fichiersFilter.createdAfter !== undefined) {
            query.andWhere("fichier.addedDate >= :createdAfter", {createdAfter: fichiersFilter.createdAfter})
        }

        if(fichiersFilter.createdBefore !== undefined) {
            query.andWhere("fichier.addedDate <= :createdBefore", {createdBefore: fichiersFilter.createdBefore})
        }

        if(fichiersFilter.parentFolderId !== undefined) {
            query.innerJoin("fichier.parentFolder","folder")
            query.andWhere("folder.id = :folderId", {folderId: fichiersFilter.parentFolderId})
        } else {
            
            query.leftJoin("fichier.parentFolder","folder")
            query.andWhere("fichier.parentFolder IS NULL")
        }

        if(fichiersFilter.gedId !== undefined) {
            query.andWhere("ged.id = :gedId", {gedId: fichiersFilter.gedId})
        }

        const fichiers = await query.getMany()
        return {
            fichiers
        }
    }

    async updateFichier(id: number, fichierParams: UpdateFichierParams, ged?: GED): Promise <Fichier | null> {
        const repoFichier = this.db.getRepository(Fichier)
        const fichierFound = await repoFichier.findOne({where: {id: id, ged: ged}})
        if(fichierFound === null) return null

        if(fichierParams.name !== undefined) {
            fichierFound.name = fichierParams.name
        }

        if(fichierParams.parentFolderId !== undefined) {
            const folderFound = await repoFichier.findOne({where: {id: fichierParams.parentFolderId, ged: ged}})
            if(folderFound !== null) {
                fichierFound.parentFolder = folderFound
                fichierFound.path = folderFound.path + folderFound.name + "/"
            }
        }

        const updatedFichier = await repoFichier.save(fichierFound)
        return updatedFichier
    }

    async deleteFichier(id: number, ged?: GED):Promise <Fichier | null> {
        const repoFichier = this.db.getRepository(Fichier)
        const fichierFound = await repoFichier.findOne({where: {id: id, ged: ged}})
        if(fichierFound === null) return null

        repoFichier.delete({id: id})
        return fichierFound
    }
    
    async replaceFile(ged: GED, path: string, name: string, type: string) {
        const query = this.db.createQueryBuilder(Fichier, 'fichier')
        query.innerJoin("fichier.ged","ged")
        query.where("ged.id = :gedId", {gedId: ged.id})
        query.andWhere("fichier.path = :path", {path: path})
        query.andWhere("fichier.type = :type", {type: type})
        query.andWhere("fichier.name = :name", {name: name})
    
        const fichier = await query.getOne()
        
        if(fichier !== null) {
            this.deleteFichier(fichier.id,fichier.ged)
        } 
    }
}

export function uploadCreationFiles(file: Fichier, assoId: number, content: string) {
    if(file.type === "folder") {
        fs.mkdir("upload/" + assoId + file.path + file.name,{recursive: true},(err) => {
            if (err) {
                return err
              }
        })
    } else {
        if(!fs.existsSync("upload/" + assoId)) {
            try {
                fs.mkdirSync("upload/" + assoId,{recursive: true})
            } catch (err) {
                console.log(err)
                return err
            }
            
        }

        fs.writeFile("upload/" + assoId + file.path + file.name, content, (err) => {
            if (err) {
                console.log(err)
                return err
              }
        })
    }
}

export const storage = (assoId: number,pathFile: string) => multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "upload/"+ assoId + pathFile);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});