import Joi from "joi"

export interface CreateMaterielRequest {
    name: string,
    type: string,
    userId: number
}

export const createMaterielValidation = Joi.object<CreateMaterielRequest>({
    name: Joi.string().required(),
    type: Joi.string().required(),
    userId: Joi.number().optional()
})

export interface GetMaterielRequest {
    id: number
}

export const getMaterielValidation = Joi.object<GetMaterielRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
* definitions:
*  UpdateMaterielRequest:
*    type: object
*    properties:
*      name:
*        type: string
*        description: Le nom du local.
*        example: "monSuperLocal"
*      country:
*        type: string
*        description: Le pays du local.
*        example: "monSuperLocal"
*      city:
*        type: string
*        description: La ville du local.
*        example: "monSuperLocal"
*      zip:
*        type: string
*        description: Le code postal du local.
*        example: "75000"
*      address:
*        type: string
*        description: L'adresse du local.
*        example: "monSuperLocal"
*    required:
*      - id
*      - montant
*/

export interface UpdateMaterielRequest {
    id: number,
    name?: string,
    type?: string,
    userId?: number
}

export const updateMaterielValidation = Joi.object<UpdateMaterielRequest>({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    userId: Joi.number().optional()
})

export interface GetListMaterielRequest {
    page?: number,
    limit?: number,
    name?: string,
    type?: string,
    userId?: number,
    isUse?: boolean
}

export const getListMaterielValidation = Joi.object<GetListMaterielRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    userId: Joi.number().optional(),
    isUse: Joi.bool().optional(),
})
