import Joi from "joi"

export interface CreateDossierRequest {
    name: string
}

export const createDossierValidation = Joi.object<CreateDossierRequest>({
    name: Joi.string().required()
})

export interface GetDossierRequest {
    id: number
}

export const getDossierValidation = Joi.object<GetDossierRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
* definitions:
*  UpdateDossierRequest:
*    type: object
*    properties:
*      id:
*        type: number
*        description: L'Id du fichier.
*        example: 123
*      name:
*        type: string
*        description: Le nom du fichier.
*        example: "monSuperDossier"
*      path:
*        type: string
*        description: Le chemin du fichier.
*        example: "monSuperDossier"
*    required:
*      - id
*/

export interface UpdateDossierRequest {
    id: number,
    name?: string
}

export const updateDossierValidation = Joi.object<UpdateDossierRequest>({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .optional()
})

export interface GetListDossierRequest {
    page?: number,
    limit?: number,
    createdAfter?: Date,
    createdBefore?: Date
}

export const getListDossierValidation = Joi.object<GetListDossierRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    createdAfter: Joi.date().iso().optional(),
    createdBefore: Joi.date().iso().optional()
})
