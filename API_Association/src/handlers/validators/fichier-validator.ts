import Joi from "joi"
import { GED } from "../../database/entities/ged"
import { Fichier } from "../../database/entities/fichier"
import { AppDataSource } from "../../database/database"

export interface CreateFichierRequest {
    name: string,
    type: string,
    parentFolderId?: number,
    content?: string
}

export const createFichierValidation = Joi.object<CreateFichierRequest>({
    name: Joi.string().required(),
    type: Joi.string().valid('file', "folder").required(),
    parentFolderId: Joi.number().optional(),
    content: Joi.string().allow("").optional()
})

export interface GetFichierRequest {
    id: number
}

export const getFichierValidation = Joi.object<GetFichierRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
* definitions:
*  UpdateFichierRequest:
*    type: object
*    properties:
*      id:
*        type: number
*        description: L'Id du fichier.
*        example: 123
*      name:
*        type: string
*        description: Le nom du fichier.
*        example: "monSuperFichier"
*      path:
*        type: string
*        description: Le chemin du fichier.
*        example: "monSuperFichier"
*    required:
*      - id
*/

export interface UpdateFichierRequest {
    id: number,
    name?: string,
    parentFolderId?: number
}

export const updateFichierValidation = Joi.object<UpdateFichierRequest>({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .optional(),
    parentFolderId: Joi.number().optional()
})

export interface GetListFichierRequest {
    page?: number,
    limit?: number,
    createdAfter?: Date,
    createdBefore?: Date,
    parentFolderId?: number
}

export const getListFichierValidation = Joi.object<GetListFichierRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    createdAfter: Joi.date().iso().optional(),
    createdBefore: Joi.date().iso().optional(),
    parentFolderId: Joi.number().optional()
})


export async function verifNameUnique(ged: GED, path: string, name: string, type: string): Promise<boolean> {
    const query = AppDataSource.createQueryBuilder(Fichier, 'fichier')
    query.innerJoin("fichier.ged","ged")
    query.where("ged.id = :gedId", {gedId: ged.id})
    query.andWhere("fichier.path = :path", {path: path})
    query.andWhere("fichier.type = :type", {type: type})
    query.andWhere("fichier.name = :name", {name: name})

    const fichier = await query.getOne()
    
    if(fichier === null) {
        return true
    } else {
        return false
    }
    
}
